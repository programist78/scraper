import { ScraperButton } from '@/components/ScraperButton/index'
import { endpoints } from './endpoints';
import { runScraper, scrapeAllEmails, scrapeWebsites,  } from './scraper';
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

