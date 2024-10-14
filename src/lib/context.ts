import { getEmbeddings } from "./embedding";
import { getPineconeClient } from "./pinecone";

export async function getContext(message: string,namespace:string) {
    try {
        const embeddings = await getEmbeddings(message);
        const client = getPineconeClient();
        const index = client.Index(process.env.PINECONE_INDEX!);
        const pinecone_namespace = index.namespace(namespace);
        const queryResult = await pinecone_namespace.query({
            topK: 5,
            vector: embeddings,
            includeMetadata: true,
            includeValues: false,
        });
        const matches =  queryResult.matches || [];
        const docs = matches.map((match)=> (match?.metadata?.text));
        return docs.join("\n").substring(0,3000);//for context length
    } catch (error) {
        console.log("error while getting context",error);
        throw error;
    }
}