import { ScraperButton } from '@/components/ScraperButton/index'

const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

export default function Home({ searchParams }: any) {

  if (searchParams.runScrapper) {
    console.log(searchParams)
    runScraper()
  }

  return (
    <div>
      <ScraperButton />
    </div>
  )
}

const runScraper = async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1300,
    height: 600
  });

  const endpoint = 'https://clutch.co/web-developers?client_budget=25000';
  await page.goto(endpoint, {
    waitUntil: 'domcontentloaded'
  });

  await wait(3000);

  await scrapeData(page);
};

const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const scrapeData = async (page: any) => {
  const $ = cheerio.load(await page.content())

  if (!await page.$('ul.directory-list')) {
    console.log('Not found')
    return
  }

  const liTags = $('ul.directory-list > li')


  liTags.each((i: any, el: any) => {
    const categoryUrl = $(el).find('.website-link__item').attr('href')
    const categoryTitle = $(el).find('.company_info > a').text().trim()

    console.log({ categoryUrl, categoryTitle })
  })
}