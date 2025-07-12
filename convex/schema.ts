import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// v here is a value validation library
export default defineSchema({
  users: defineTable({
    userId: v.string(), // clerk-id
    email: v.string(),
    name: v.string(),
    isPro : v.boolean(),
    ProSince : v.optional(v.number()),
    lemonSqueezyCustomerId : v.optional(v.string()),
    lemonSqueezyOrderId : v.optional(v.string()),
   }).index("by_userId", ["userId"]), // Creates an index on userId field for faster lookups

   codeExecution : defineTable({
    userId : v.string(),
    code : v.string(),
    language : v.string(),
    output :v.optional( v.string()),
    error : v.optional(v.string()),
   }).index("by_userId", ["userId"]),

   snippets : defineTable({
    userId : v.string(),
    title : v.string(),
    code : v.string(),
    language : v.string(),
    userName : v.string(), // store the user name here
   }).index("by_userId", ["userId"]),

   snippetsComments : defineTable({
    snippetId : v.id("snippets"), // References a document in the snippets table - acts as a foreign key
    userId : v.string(),
    content : v.string(), //this will store the comment
    userName : v.string(),
   }).index("by_snippetId", ["snippetId"]), // Creates an index on snippetId field for faster lookups of comments by snippet
  
   stars: defineTable({
    userId: v.string(),// Stores the ID of the user who starred
    snippetId: v.id("snippets"),  // References the ID of the snippet being starred
  }).index("by_userId", ["userId"])//Creates an index to quickly find all snippets starred by a specific user
    .index("by_snippetId", ["snippetId"])//Creates an index to quickly find all users who starred a specific snippet
    .index("by_userId_snippetId", ["userId", "snippetId"]),
    // Creates a compound index that allows for:
   //- Quick verification if a specific user has starred a specific snippet

});