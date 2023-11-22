import { Page } from "@/node_modules/puppeteer/lib/types";

const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

interface RunScraper {
    endpoint: string
    scrapeDataFn: (page: Page) => Promise<void>;
}

export const runScraper = async ({ endpoint, scrapeDataFn }: RunScraper) => {
    const browser = await puppeteer.launch({
        headless: false
    });

    const page: Page = await browser.newPage();

    await page.setViewport({
        width: 1300,
        height: 600
    });

    try {
        await page.goto(endpoint, {
            waitUntil: 'domcontentloaded'
        });

        await wait(3000);

        await scrapeDataFn(page)
    } catch (error) {
        console.error('Error occurred during scraping:', error);
    } finally {
        await browser.close();
    }
};

const wait = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export const scrapeAllEmails = async (page: Page) => {
    const $ = cheerio.load(await page.content())

    if (!await page.$('a')) {
        console.log('Not found links')
        return
    }

    const linksTags = $('a')

    linksTags.each((i: any, el: any) => {
        const href = $(el).attr('href')

        if (href?.includes('@')) {
            const replacedEmail = href.replace(/mailto:/g, '')

            console.log({ email: replacedEmail })
        }
    })
}

export const scrapeWebsites = async (page: any) => {
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