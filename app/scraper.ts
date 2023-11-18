const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

export const runScraper = async (endpoint: string) => {
    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.setViewport({
        width: 1300,
        height: 600
    });

    try {
        await page.goto(endpoint, {
            waitUntil: 'domcontentloaded'
        });

        await wait(3000);

        await scrapeData(page);
    } catch (error) {
        console.error('Error occurred during scraping:', error);
    } finally {
        await browser.close();
    }
};

const wait = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

const scrapeData = async (page: any) => {
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