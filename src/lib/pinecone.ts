import {Pinecone,PineconeRecord} from '@pinecone-database/pinecone';
import { scrape_urls } from './scraper';
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters"
import { Document } from '@langchain/core/documents';
import { MD5 } from 'crypto-js';
import { getEmbeddings } from './embedding';

export const getPineconeClient = () =>{
    return new Pinecone({
        apiKey: process.env.PINECONE_API_KEY!,
    });
};

export async function insertIntoPineCone(urls: string[]) {

    try {
        console.log(
            "inside the insertIntoPinecone function calling scrape urls \n"
        );
        //1.scrape all the urls and get the info
        const scraped_content = await scrape_urls(urls);

        console.log("scraped_content done calling prepare chunks now \n");
        //2. split and segment the content
        const documents = (await prepareChunks(scraped_content)) as Document[];

        console.log("documents got now embedding each \n");
        //3.vectorize and embed individal documents
        const vectors = await Promise.all(documents.flat().map(embedDocument));
        console.log("vectors got now inserting into pinecone \n");

        //4. upload to pinecone
        const client = await getPineconeClient();
        const index = client.Index(process.env.PINECONE_INDEX!);
        const unique_namespace = createNamespace();
        const namespace = index.namespace(unique_namespace);

        console.log("inserting vectors into pinecone \n");
        await namespace.upsert(vectors);

        console.log("done inserting vectors into pinecone \n");
        return unique_namespace;
    } catch (error) {
        console.log("error in insert into pinecone \n", error);
        throw error
    }
}

async function embedDocument(doc: Document){
    try {
        console.log("inside embed document \n");

        console.log("page content is \n",doc.pageContent);
        const embeddings = await getEmbeddings(doc.pageContent);
        const hash = MD5(doc.pageContent).toString();

        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.pageContent //only storing the page content
            },
        } as PineconeRecord;
    } catch (error) {
        console.log("error embedding document \n",error);
        throw error;
    }
}

async function prepareChunks(
  content: string
):Promise<Document[]>{

    console.log("inside prepare chunks function \n");
    const pageContent = content.replace(/\n/g, "");
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 200,
        chunkOverlap: 20,
    });

    const chunks = await splitter.createDocuments([pageContent]) as Document[];
    console.log("chunks created are \n", chunks);
    return chunks;
}

function createNamespace(): string {
    console.log("inside create namespace function \n");
    const date = new Date().toISOString();
    const rand = Math.floor(Math.random() * 1000000);
    return `${date}-${rand}`;
}
