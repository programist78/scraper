import { ScraperButton } from '@/components/ScraperButton/index'
import { endpoints } from './endpoints';
import { runScraper, scrapeAllEmails, scrapeWebsites, scrapeProfile  } from './scraper';
// import { addClientRun } from './utils/AddClientRun';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});


const ADD_CLIENT = gql`
mutation Mutation($input: addClientsInput) {
  addClient(input: $input) {
    email
    companyName
    websiteLink
    businessType
    clutchLink
  }
}
`;

const updateClient = gql`
mutation Mutation($input: updateClientsInput) {
  updateClient(input: $input) {
    id
    websiteLink
  }
}
`;

// Define a function to run the mutation
async function addClientRun(data: any) {
    try {
        const response = await client.mutate({
            mutation: ADD_CLIENT,
            variables: {
                input: data
            },
        });
        console.log("Mutation completed: ", response);
    } catch (err) {
        console.error("Error running mutation: ", err);
    }
}

async function updateClientRun(data: any) {
  const { __typename, ...inputData } = data;
  try {
      const response = await client.mutate({
          mutation: updateClient,
          variables: {
              input: inputData
          },
          refetchQueries: ['GetClients']
      });
      console.log("Mutation completed: ", response);
  } catch (err) {
      console.error("Error running mutation: ", JSON.stringify(err, null, 2));
  }
}

async function getClients(page: number = 1, size: number = 5) {
  try {
    const response = await client.query({
      query: gql`
        query GetClients($page: Int!, $size: Int!) {
          getClientsWithoutWebsite( input: {page: $page, size: $size }) {
            id
            email
            companyName
            websiteLink
            businessType
            clutchLink
          }
        }
      `,
      variables: {
        page,
        size,
      },
      fetchPolicy: 'no-cache'
    });

    return response.data.getClientsWithoutWebsite;
  } catch (err) {
    console.error("Error running query: ", JSON.stringify(err, null, 2));
  }
}

export default function Home({ searchParams }: any) {

  if (searchParams.runScrapper) {
    console.log(searchParams)

    const runScrapers = async () => {
      console.log('Start scrapers');

      const emailScrapers = endpoints.map(async (endpoint: string) => {
        return await runScraper({
          endpoint: endpoint,
          scrapeDataFn: scrapeAllEmails
        });
      });

      await Promise.all(emailScrapers);
      console.log('All scrapers finished');
    };

    runScrapers();
  }

  if (searchParams.runProfileScrapper) {
    const runScrapers = async () => {
      console.log('Start Profile scrapers');
      const PAGE_SIZE = 5;
      const scrappedData: string[] = [];
      let currentPage = 0;

      let clientsData = await getClients(++currentPage, PAGE_SIZE);
      while(clientsData.length) {
        console.log('>>> Current page:', currentPage, 'Clients:', clientsData.length);

        await Promise.all(clientsData.map(async (client: any) => {
          const profileUrl = `https://clutch.co${client.clutchLink}`;
          const clientsData = await runScraper({
            endpoint: profileUrl,
            scrapeDataFn: scrapeProfile,
          });

          if (clientsData) {
            await updateClientRun({
              websiteLink: clientsData,
              id: client.id
            });
          }

          scrappedData.push(clientsData);
        }));

        clientsData = await getClients(++currentPage, PAGE_SIZE);
      }

      console.log('>>> Scrapped data:', JSON.stringify(scrappedData, null, 2));

    };

    runScrapers();
  }

  if (searchParams.runWebsiteScrapper) {
    const startIndex = 0
    const length = 5


    const runScrapers = async () => {
      console.log('Start Website scrapers');
      const websiteScrapers = Array.from({ length: length }, async (_, index) => {
        const currentPage = startIndex + index;
        // const endpoint = `https://clutch.co/call-centers/answering-services?page=${currentPage}`;
        const endpoint = `https://clutch.co/profile/first-point-communications#highlights`;
        console.log(endpoint)
        // const endpoint = `https://clutch.co/web-developers?client_budget=25000&page=15`;
        const clientsData: any = await runScraper({
          endpoint: endpoint,
          scrapeDataFn: scrapeWebsites
        });
        // console.log(data)
        for (const data of clientsData) {
          console.log(data)
          await addClientRun(data); // This ensures each mutation is awaited
      }
        // console.log(data)
        // return await AddClientRun(data)
      })

      await Promise.all(websiteScrapers);
    };

    runScrapers();
  }

  return (
    <div>
      <ScraperButton />
    </div>
  )
}
