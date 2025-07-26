import { mutationGeneric as mutation, queryGeneric as query } from "convex/server";
import { v } from "convex/values";

// Mutation to add a new lift
export const addLift = mutation({
  args: {
    exercise: v.string(),
    weight: v.number(),
    reps: v.number(),
    sets: v.number(),
    date: v.string(), // ISO date string
    userId: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    const id = await ctx.db.insert("lifts", {
      exercise: args.exercise,
      weight: args.weight,
      reps: args.reps,
      sets: args.sets,
      date: args.date,
      userId: args.userId,
    });
    return id;
  },
});

// Query to get lifts for a user, optionally filtered by exercise or date range
export const getLifts = query({
  args: {
    userId: v.string(),
    exercise: v.optional(v.string()),
    startDate: v.optional(v.string()), // ISO date string
    endDate: v.optional(v.string()),   // ISO date string
  },
  handler: async (ctx: any, args: any) => {
    let lifts = await ctx.db
      .query("lifts")
      .withIndex("by_userId", (q: any) => q.eq("userId", args.userId))
      .collect();

    if (args.exercise) {
      lifts = lifts.filter((lift: any) => lift.exercise === args.exercise);
    }
    if (args.startDate) {
      lifts = lifts.filter((lift: any) => lift.date >= args.startDate!);
    }
    if (args.endDate) {
      lifts = lifts.filter((lift: any) => lift.date <= args.endDate!);
    }
    // Sort by date descending (most recent first)
    lifts.sort((a: any, b: any) => b.date.localeCompare(a.date));
    return lifts;
  },
}); 