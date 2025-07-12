import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

//mutation is a function that allows you to make changes to the database
// It's similar to an API endpoint that specifically handles data modifications
// Mutations are secure because they run on the server side, even though you call them from your client code
// we made a mutation that checks if the user exists in the database and if not, then creates a new user in the database
// we are using clerk to authenticate the user so we need to pass the userId, email, and name to the mutation 

export const syncUser = mutation({
args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    
},
handler: async (ctx, args) => {
    //checking if user already exists in the database and if not, then creating a new user in the database
    const existingUser = await ctx.db.query("users")
    //q-->query eq-->equal to field userId
    .filter(q => q.eq(q.field("userId"), args.userId)).first();
    if (!existingUser) {
        // if user does not exist, then create a new user in the database
        // ctx.db is the database object 

        await ctx.db.insert("users", {
            userId: args.userId,
            email: args.email,
            name: args.name,
            isPro: false,
    
        });    
    } 
}


});

export const getUser = query({
    args: { userId: v.string() },
  
    handler: async (ctx, args) => {
      if (!args.userId) return null;
  
      const user = await ctx.db
        .query("users")
        .withIndex("by_userId")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .first();   
  
      if (!user) return null;
  
      return user;
    },
  });