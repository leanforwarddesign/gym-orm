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
  },
  {
    name: "Back & Arms", 
    description: "Pull-focused workout for back and arm development",
  },
  {
    name: "Legs",
    description: "Lower body strength and power training",
  },
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  
  const today = new Date().toISOString().split('T')[0];
  
  const lifts = useQuery(api.lifts.getLifts, isAuthenticated ? {} : "skip");

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

  const sortedGroupedLifts = Object.values(groupedLifts).sort((a: any, b: any) => 
    b.date.localeCompare(a.date)
  );

  const handleWorkoutTypeSelect = (workoutType: string) => {
    if (!isAuthenticated) return;
    router.push(`/tracker?workoutType=${encodeURIComponent(workoutType)}`);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Loading...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="w-full p-4 flex justify-end">
        {isAuthenticated ? (
          <UserButton />
        ) : (
          <SignInButton>
            <Button variant="outline">Sign In</Button>
          </SignInButton>
        )}
      </header>

      <main className="flex flex-col items-center justify-center">
        {!isAuthenticated ? (
          <div className="text-center py-16 max-w-2xl mx-auto">
            <h1 className="text-5xl font-bold mb-10">Welcome to Gym Tracker</h1>
            <p className="text-xl text-muted-foreground mb-8">Time to get massive</p>
            <SignInButton>
              <Button size="lg" className="rounded px-4 py-2">Get Started</Button>
            </SignInButton>
          </div>
        ) : (
          <div className="space-y-12">
            <section className="text-center">
              <h2 className="text-3xl font-bold mb-8">Choose Your Workout</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                {workoutTypes.map((workout) => (
                  <Card 
                    key={workout.name} 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-2 hover:border-primary/20"
                    onClick={() => handleWorkoutTypeSelect(workout.name)}
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{workout.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {workout.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-3xl font-bold text-center">Recent Workouts</h2>
              {sortedGroupedLifts.length === 0 ? (
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="py-16 text-center">
                    <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                      <svg
                        className="w-12 h-12 text-muted-foreground"
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
                    <h3 className="text-xl font-semibold mb-3">No workouts yet</h3>
                    <p className="text-muted-foreground">
                      Start by selecting a workout type above to log your first session!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6 max-w-4xl mx-auto">
                  {sortedGroupedLifts.map((session: any) => {
                    const totalSets = session.lifts.reduce((sum: number, lift: any) => sum + lift.sets, 0);
                    const uniqueExercises = new Set(session.lifts.map((lift: any) => lift.exercise)).size;
                    
                    return (
                      <Card key={`${session.workoutType}-${session.date}`}>
                        <CardHeader>
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div>
                              <CardTitle className="text-xl">{session.workoutType}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {new Date(session.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {uniqueExercises} exercises • {totalSets} sets
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {session.lifts.map((lift: any) => (
                              <div key={lift._id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 py-2 border-b border-muted/50 last:border-0">
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
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
