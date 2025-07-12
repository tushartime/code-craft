

import { WebhookEvent } from "@clerk/nextjs/server";
import { httpAction } from "./_generated/server";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";
    
import {api} from "./_generated/api";

const http = httpRouter();
// listening for a post request from clerk to the server
http.route({
    path: "/clerk-webhook",
    method: "POST",
    // httpaction is a function that takes a context and a request and returns a response
    handler: httpAction(async (ctx, request) => {
        const webhooksecret= process.env.CLERK_WEBHOOK_SECRET;
        //process.env is like a storage box for environment variables - special settings and secret values that your application needs to run.
        if(!webhooksecret){
            throw new Error("Clerk webhook secret not found");
        }
        // check if webhook is from clerk
        const svix_id= request.headers.get("svix-id");
        const svix_timestamp= request.headers.get("svix-timestamp");
        const svix_signature= request.headers.get("svix-signature");
        // check if all headers are present
        if(!svix_id || !svix_timestamp || !svix_signature){
            return new Response("Missing headers",{status:400});
        }
        
        const payload= await request.json();//extracts the JSON data from the incoming webhook request from Clerk
        const body= JSON.stringify(payload);//converts the parsed JSON object back into a string
        //create a new webhook object from the svix library
        const wh = new Webhook(webhooksecret);
        let evt: WebhookEvent;
        //verify the webhook
        try{
            evt= wh.verify(body,{
                "svix-id":svix_id,
                "svix-timestamp":svix_timestamp,
                "svix-signature":svix_signature,
            }) as WebhookEvent; 
         }
          catch(err){
                console.error("Error verifying webhook:",err);
                return new Response("Error verifying webhook",{status:400});
            }

            const eventtype= evt.type;
            if(eventtype==="user.created" ){
                //save the user to the database 
                const{id,email_addresses,first_name,last_name}=evt.data;
                //email_addresses is an array of email addresses associated with the user so get tehe first
                //first_name and last_name are the first and last name of the user join them together
                const email= email_addresses[0].email_address;
                const name= `${first_name||""}${last_name||""}`.trim();
                //save the user to the database
                try{
                    await ctx.runMutation(api.users.syncUser,{userId:id,email,name});
                    
                }
                catch(error){
                    console.error("Error creating user $",error);
                    return new Response("Error saving user to database",{status:500});
                }
            }
            return new Response("webhook processed succesfully ",{status:200});
        
    }),
});

export default http;