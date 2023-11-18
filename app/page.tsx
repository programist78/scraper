import { ScraperButton } from '@/components/ScraperButton/index'
import { endpoints } from './endpoints';
import { runScraper } from './scraper';

export default function Home({ searchParams }: any) {

  if (searchParams.runScrapper) {
    console.log(searchParams)

    const runScrapers = async () => {
      console.log('Start scrapers');

      const promises = endpoints.map(async (endpoint: string) => {
        return await runScraper(endpoint);
      });

      await Promise.all(promises);
      console.log('All scrapers finished');
    };

    runScrapers();
  }

  return (
    <div>
      <ScraperButton />
    </div>
  )
}

