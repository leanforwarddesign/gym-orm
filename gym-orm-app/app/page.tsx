"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dumbbell, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

function calculate1RM(weight: number, reps: number) {
  // Epley formula
  return Math.round(weight * (1 + reps / 30));
}

const workoutTypes = [
  {
    name: "Chest & Shoulders",
    exercises: [
      "Bench Press",
      "Incline Bench Press",
      "Overhead Press",
      "Lateral Raise",
      "Chest Fly",
    ],
      // icon: "💪",
      // color: "bg-red-500"
  },
  {
    name: "Back & Arms",
    exercises: [
      "Bent Over Rows",
      "Lat Pulldown",
      "T-bar Row",
      "Bicep Curls",
      "Hammer Curls",
      "Barbell Curls",
      "Forearm Curls",
    ],
    // icon: "🎯",
    // color: "bg-blue-500"
  },
  {
    name: "Legs",
    exercises: [
      "Squats",
      "Deadlifts",
      "Leg Press",
      "Leg Extension",
      "Leg Curl",
      "Calf Raises",
      "Glute Bridges",
    ],
    // icon: "🦵",
    // color: "bg-green-500"
  },
];

export default function Home() {
  const router = useRouter();
  const userId = "demo-user";
  
  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Get all lifts for the user
  const lifts = useQuery(api.lifts.getLifts, { userId });

  // Group lifts by workout type and date
  const groupedLifts = lifts ? lifts.reduce((acc: any, lift: any) => {
    const workoutType = lift.workoutType || "Other";
    const date = lift.date;
    const key = `${workoutType}-${date}`;
    
    if (!acc[key]) {
      acc[key] = {
        workoutType,
        date,
        lifts: []
      };
    }
    acc[key].lifts.push(lift);
    return acc;
  }, {}) : {};

  // Sort grouped lifts by date (most recent first)
  const sortedGroupedLifts = Object.values(groupedLifts).sort((a: any, b: any) => 
    b.date.localeCompare(a.date)
  );

  const handleWorkoutTypeSelect = (workoutType: string) => {
    router.push(`/tracker?workoutType=${encodeURIComponent(workoutType)}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-4xl">
      <div className="container mx-auto">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Dumbbell className="h-8 w-8" />
              <h1 className="text-4xl font-bold tracking-tight">Gym Tracker</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Select your workout type to get started
            </p>
          </div>

          {/* Workout Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Choose Your Workout</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {workoutTypes.map((workout) => (
                  <Button
                    key={workout.name}
                    onClick={() => handleWorkoutTypeSelect(workout.name)}
                    variant="outline"
                    className="h-30 pt-4 p-6 flex flex-col items-center gap-4 hover:shadow-lg transition-all"
                  >
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">{workout.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {workout.exercises.length} exercises
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Workouts */}
          {sortedGroupedLifts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Recent Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {sortedGroupedLifts.map((group: any, index: number) => (
                    <AccordionItem key={index} value={`workout-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center justify-between w-full mr-4">
                          <div>
                            <span className="font-semibold">{group.workoutType}</span>
                            <span className="text-muted-foreground ml-2">
                              ({group.lifts.length} exercises)
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(group.date).toLocaleDateString()}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="overflow-hidden rounded-lg border">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-muted/30">
                                <TableHead>Exercise</TableHead>
                                <TableHead className="text-right">Weight (kg)</TableHead>
                                <TableHead className="text-right">Reps</TableHead>
                                <TableHead className="text-right">Sets</TableHead>
                                <TableHead className="text-right">1RM (kg)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {group.lifts.map((lift: any) => (
                                <TableRow key={lift._id}>
                                  <TableCell className="font-medium">{lift.exercise}</TableCell>
                                  <TableCell className="text-right">{lift.weight}</TableCell>
                                  <TableCell className="text-right">{lift.reps}</TableCell>
                                  <TableCell className="text-right">{lift.sets}</TableCell>
                                  <TableCell className="text-right font-semibold">
                                    {calculate1RM(lift.weight, lift.reps)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  );
}
