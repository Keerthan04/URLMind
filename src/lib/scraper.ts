import "@mendable/firecrawl-js";
import { FireCrawlLoader } from "@langchain/community/document_loaders/web/firecrawl";

export async function scrape_urls(urls: string[]): Promise<string> {
    //try doing the scrape not from this instead of my own function scraping so that i get good data this does not look good and also the chunk size for the character splitting can be increased so see to that also
    console.log("inside the scrape urls function \n");
    const docs = await Promise.all(urls.map(scrape_url));
    return docs.join(" ");
    //sending all scraped as one content
}

async function scrape_url(url:string){
    console.log("inside the scrape url function now \n");
    const loader = new FireCrawlLoader({
      url: url,
      apiKey: process.env.FIRECRAWL_API_KEY,
      mode:"scrape"//scrape only one page so
    });
    const doc = await loader.load();
    return doc[0].pageContent;
}
