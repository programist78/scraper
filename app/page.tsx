import { ScraperButton } from '@/components/ScraperButton/index'
import { endpoints } from './endpoints';
import { runScraper, scrapeAllEmails, scrapeWebsites } from './scraper';

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
    const pageSize = 5

    const runScrapers = async () => {
      console.log('Start Website scrapers');

      const websiteScrapers = Array.from({ length: pageSize }, async (_, index) => {
        const endpoint = `https://clutch.co/web-developers?client_budget=25000?page=${index}`;

        return await runScraper({
          endpoint: endpoint,
          scrapeDataFn: scrapeWebsites
        });

      })

      await Promise.all(websiteScrapers);
      console.log('All Website scrapers finished');
    };

    runScrapers();
  }

  return (
    <div>
      <ScraperButton />
    </div>
  )
}

