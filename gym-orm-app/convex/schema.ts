import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  lifts: defineTable(
    v.object({
      exercise: v.string(),
      weight: v.number(),
      reps: v.number(),
      sets: v.number(),
      date: v.string(), // ISO date string
      userId: v.string(), // Optional: for future user auth
    })
  ).index('by_userId', ['userId'])
}); 