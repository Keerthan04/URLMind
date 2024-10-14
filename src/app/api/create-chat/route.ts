import { db } from "@/db";
import { chats } from "@/db/schema";
import { insertIntoPineCone } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(req: Request,res:Response) {
    const {userId} = await auth();
    if(!userId){
        return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }
    //now no need the auth so commenting it now
    try {
        const body = await req.json();
        const {urls,chat_name} = body;//will get all the urls as array of url
        console.log("urls are \n",urls);
        console.log("chat name is \n",chat_name);

        console.log("calling insert into pinecone from route\n");
        const namespace = await insertIntoPineCone(urls);

        console.log("insert into pinecone done and got back at route \n");

        console.log("inserting into database from root now \n");

        const chat_id = await db
          .insert(chats)
          .values({
            chat_name: chat_name,
            userId: userId,
            namespace_name: namespace,
            //created at and id will be added by itself
          })
          .returning({
            insertedId: chats.id,
          });

        console.log("done inserting into table now returning back from route \n");

        return NextResponse.json({chat_id:chat_id[0].insertedId}, {status: 200});

    } catch (error) {
        console.error(error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    };
}