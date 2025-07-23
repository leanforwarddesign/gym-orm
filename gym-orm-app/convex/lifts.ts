import { mutationGeneric, queryGeneric } from 'convex/server';
import { v } from 'convex/values';

// Add a new lift log
export const addLift = mutationGeneric({
  args: {
    exercise: v.string(),
    weight: v.number(),
    reps: v.number(),
    sets: v.number(),
    date: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('lifts', args);
  },
});

// Get all lift logs for a user, sorted by date
export const getLifts = queryGeneric({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('lifts')
      .filter(q => q.eq(q.field('userId'), args.userId))
      .order('desc')
      .collect();
  },
}); 