import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { p } from "framer-motion/client";

export const saveExecution = mutation({
  args: {
    language: v.string(),
    code: v.string(),
    // we could have either one of them, or both at the same time
    output: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Not authenticated");

    // check pro status
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId")
      .filter((q) => q.eq(q.field("userId"), identity.subject))
      .first();

    if (!user?.isPro && args.language !== "javascript") {
      throw new ConvexError("Pro subscription required to use this language");
    }

    await ctx.db.insert("codeExecution", {
      ...args,
      userId: identity.subject,
    });
  },
});

export const getUserExecutions = query({
  args: {
    userId: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("codeExecution")
      .withIndex("by_userId")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});



export const getUserStats = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const executions = await ctx.db
      .query("codeExecution")
      .withIndex("by_userId")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Get starred snippets
    const starredSnippets = await ctx.db
      .query("stars")
      .withIndex("by_userId")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();

    // Get all starred snippet details to analyze languages
    const snippetIds = starredSnippets.map((star) => star.snippetId);
    const snippetDetails = await Promise.all(snippetIds.map((id) => ctx.db.get(id)));
    //the code is saying: "First, get me a list of all the IDs of snippets this user has starred. 
    // Then, go fetch the complete information for each of those snippets so I can analyze them."
    //This is necessary because the "stars" table only contains the relationship between users
    //  and snippets (who starred what), but not the actual snippet content or metadata
    //  like the programming language used.

    // Calculate most starred language
    const starredLanguages = snippetDetails.filter(Boolean).reduce(
      (acc, curr) => {
        if (curr?.language) {
          acc[curr.language] = (acc[curr.language] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    // snippetDetails.filter(Boolean) - This filters out any null or undefined values from the snippetDetails array
    // .reduce() - This method transforms the array into a single object that counts occurrences of each language.
    //  The reduce function takes two parameters: an accumulator (acc) and the current element (curr).
    //  For each element, it checks if the language property exists (curr?.language), and if it does, 
    // it increments the count for that language in the accumulator.

    const mostStarredLanguage =
      Object.entries(starredLanguages).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "N/A";
      
// - Object.entries(starredLanguages) - This converts the starredLanguages object into an array of key-value pairs. For example, if starredLanguages is { "javascript": 5, "python": 3 } , this would produce [["javascript", 5], ["python", 3]] .
// - .sort(([, a], [, b]) => b - a) - This sorts the array of pairs by the count values (the second element in each pair) in descending order. The [, a] syntax is using array destructuring to ignore the first element (language name) and only compare the second element (count).
// - [0] - This gets the first element after sorting, which will be the pair with the highest count.
// - ?.[0] - This uses optional chaining to safely access the first element of that pair (the language name). If there are no starred languages, this prevents an error.
// - ?? "N/A" - This is the nullish coalescing operator, which provides a fallback value of "N/A" if the previous expression evaluates to null or undefined.

    // Calculate execution stats
    const last24Hours = executions.filter(
      (e) => e._creationTime > Date.now() - 24 * 60 * 60 * 1000
    ).length;
     
// 1. (e) => e._creationTime > Date.now() - 24 * 60 * 60 * 1000 - This is the filter condition:
//    - Date.now() returns the current timestamp in milliseconds
//    - 24 * 60 * 60 * 1000 calculates 24 hours in milliseconds (24 hours × 60 minutes × 60 seconds × 1000 milliseconds)
//    - Date.now() - 24 * 60 * 60 * 1000 gives us the timestamp from exactly 24 hours ago
//    - The filter keeps only executions where _creationTime (when the execution was created) is greater than (more recent than) the timestamp from 24 hours ago
// 2. .length - After filtering, this counts how many executions match the criteria
// So in simple terms, this line counts how many code executions the user has performed in the past 24 hours, which is then returned as part of the user statistics.
    const languageStats = executions.reduce(
      (acc, curr) => {
        acc[curr.language] = (acc[curr.language] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const languages = Object.keys(languageStats);
    // his extracts all the language names (keys) from the languageStats object into an array. For example, if languageStats is { "javascript": 10, "python": 5, "typescript": 3 } , then languages will be ["javascript", "python", "typescript"] .
    const favoriteLanguage = languages.length
      ? languages.reduce((a, b) => (languageStats[a] > languageStats[b] ? a : b))
      : "N/A";

//       1. first, it checks if there are any languages at all ( languages.length ).
// 2. If there are languages:
//    - It uses reduce() to compare each language with the current "winner"
//    - For each pair of languages (a and b), it compares their counts in languageStats
//    - It keeps the language with the higher count ( languageStats[a] > languageStats[b] ? a : b )
//    - This effectively finds the language with the maximum usage count
// 3. If there are no languages, it sets favoriteLanguage to "N/A"
// For example, with the stats { "javascript": 10, "python": 5, "typescript": 3 } , this would determine that "javascript" is the favorite language since it has the highest count (10).

    return {
      totalExecutions: executions.length,
      languagesCount: languages.length,
      languages: languages,
      last24Hours,
      favoriteLanguage,
      languageStats,
      mostStarredLanguage,
    };
  },
});