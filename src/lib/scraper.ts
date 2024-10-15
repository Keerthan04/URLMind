import axios from "axios";
import * as cheerio from "cheerio";

// import "@mendable/firecrawl-js";
// import { FireCrawlLoader } from "@langchain/community/document_loaders/web/firecrawl";

// export async function scrape_urls(urls: string[]): Promise<string> {
//   //try doing the scrape not from this instead of my own function scraping so that i get good data this does not look good and also the chunk size for the character splitting can be increased so see to that also
//   console.log("inside the scrape urls function \n");
//   const docs = await Promise.all(urls.map(scrape_url));
//   return docs.join(" ");
//   //sending all scraped as one content
// }

// async function scrape_url(url: string) {
//   console.log("inside the scrape url function now \n");
//   const loader = new FireCrawlLoader({
//     url: url,
//     apiKey: process.env.FIRECRAWL_API_KEY,
//     mode: "scrape", //scrape only one page so
//   });
//   const doc = await loader.load();
//   return doc[0].pageContent;
// }

export async function scrape_urls(urls: string[]):Promise<string>{
  console.log("inside the scrape urls function \n");
  try {
    const docs = await Promise.all(urls.map(scrapeTextAndCode));
    return docs.join(" ");
  } catch (error) {
    console.error("error in the scrape urls function \n",error);
    throw error
  }
}
async function scrapeTextAndCode(url: string): Promise<string> {
  try {
    // Send a request to the webpage
    const response = await axios.get(url);

    // Load the webpage content using Cheerio
    const $ = cheerio.load(response.data);

    // Initialize an empty array to store text and code snippets
    const contentList: string[] = [];

    // Extract all text and code snippets, ignoring links
    $("p, h1, h2, h3, h4, h5, h6, pre, code").each((_, element) => {
      const tagName = $(element).prop("tagName").toLowerCase();

      // Skip any text inside anchor tags (links)
      if (tagName === "a") {
        return;
      }

      // If it's a code block, handle it separately
      if (tagName === "pre" || tagName === "code") {
        contentList.push(`\nCode:\n${$(element).text().trim()}\n`);
      } else {
        contentList.push($(element).text().trim());
      }
    });

    // Join the list items into a single string for the entire scraped document
    const scrapedContent = contentList.join("\n\n");
    return scrapedContent;
  } catch (error) {
    console.error("Error scraping the webpage:", error);
    throw error;
  }
}
