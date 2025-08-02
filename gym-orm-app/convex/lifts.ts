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
    workoutType: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    // Check if user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const id = await ctx.db.insert("lifts", {
      exercise: args.exercise,
      weight: args.weight,
      reps: args.reps,
      sets: args.sets,
      date: args.date,
      userId: identity.subject, // Use the authenticated user's ID
      workoutType: args.workoutType,
    });
    return id;
  },
});

// Query to get lifts for the authenticated user, optionally filtered by exercise or date range
export const getLifts = query({
  args: {
    exercise: v.optional(v.string()),
    startDate: v.optional(v.string()), // ISO date string
    endDate: v.optional(v.string()),   // ISO date string
    workoutType: v.optional(v.string()),
  },
  handler: async (ctx: any, args: any) => {
    // Check if user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    let lifts = await ctx.db
      .query("lifts")
      .withIndex("by_userId", (q: any) => q.eq("userId", identity.subject))
      .collect();

    if (args.exercise) {
      lifts = lifts.filter((lift: any) => lift.exercise === args.exercise);
    }
    if (args.workoutType) {
      lifts = lifts.filter((lift: any) => lift.workoutType === args.workoutType);
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

export const deleteLift = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    // Check if user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the lift to verify ownership
    const lift = await ctx.db.get(args.id);
    if (!lift) {
      throw new Error("Lift not found");
    }

    // Verify that the authenticated user owns this lift
    if (lift.userId !== identity.subject) {
      throw new Error("Not authorized to delete this lift");
    }

    await ctx.db.delete(args.id);
  },
});