"use client";

import { useQuery, useConvexAuth } from "convex/react";
import { api } from "../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { SignInButton, UserButton } from "@clerk/nextjs";

const workoutTypes = [
  {
    name: "Chest & Shoulders",
    description: "Upper body power workout focusing on chest and shoulders",
    // icon: "🔥", 
    // color: "bg-orange-500"
  },
  {
    name: "Back & Arms", 
    description: "Pull-focused workout for back and arm development",
    // icon: "💪",
    // color: "bg-blue-500"
  },
  {
    name: "Legs",
    description: "Lower body strength and power training",

    // icon: "🦵",
    // color: "bg-green-500"
  },
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  
  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Get all lifts for the user - only when authenticated
  const lifts = useQuery(api.lifts.getLifts, isAuthenticated ? {} : "skip");

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
    if (!isAuthenticated) return;
    router.push(`/tracker?workoutType=${encodeURIComponent(workoutType)}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Gym Tracker</h1>
          <p className="text-xl text-muted-foreground">
            Track your workouts and monitor your progress
          </p>
        </div>
        {isAuthenticated ? (
          <UserButton />
        ) : (
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Welcome to Gym Tracker</h2>
          <p className="text-muted-foreground mb-6">Sign in to start tracking your workouts and progress</p>
          <SignInButton>
            <Button size="lg">Get Started</Button>
          </SignInButton>
        </div>
      ) : (
        <>
          {/* Workout Type Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Choose Your Workout</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {workoutTypes.map((workout) => (
                <Card 
                  key={workout.name} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={() => handleWorkoutTypeSelect(workout.name)}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{workout.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      {workout.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Workouts */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Recent Workouts</h2>
            {sortedGroupedLifts.length === 0 ? (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-10 h-10 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No workouts yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Start by selecting a workout type above to log your first session!
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sortedGroupedLifts.map((session: any) => {
                  const totalSets = session.lifts.reduce((sum: number, lift: any) => sum + lift.sets, 0);
                  const uniqueExercises = new Set(session.lifts.map((lift: any) => lift.exercise)).size;
                  
                  return (
                    <Card key={`${session.workoutType}-${session.date}`}>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-lg">{session.workoutType}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {new Date(session.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              {uniqueExercises} exercises • {totalSets} sets
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {session.lifts.map((lift: any) => (
                            <div key={lift._id} className="flex justify-between items-center py-2 border-b border-muted last:border-0">
                              <span className="font-medium">{lift.exercise}</span>
                              <span className="text-sm text-muted-foreground">
                                {lift.sets} sets × {lift.reps} reps @ {lift.weight}kg
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
