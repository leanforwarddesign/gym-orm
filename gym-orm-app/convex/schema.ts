import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  lifts: defineTable(
    v.object({
      exercise: v.string(),
      weight: v.number(),
      reps: v.number(),
      sets: v.number(),
      date: v.string(), 
      userId: v.string(),
      workoutType: v.string(), // "Chest & Shoulders", "Back & Arms", "Legs"
    })
  ).index('by_userId', ['userId'])
    .index('by_userId_workoutType', ['userId', 'workoutType'])
}); 