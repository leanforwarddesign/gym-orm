"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function calculate1RM(weight: number, reps: number) {
  // Epley formula
  return Math.round(weight * (1 + reps / 30));
}

export default function Home() {
  // Form state
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState(90);
  const [reps, setReps] = useState(0);
  const [sets, setSets] = useState(0);
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Placeholder userId (replace with real auth later)
  const userId = "demo-user";

  // Convex hooks
  const addLift = useMutation(api.lifts.addLift);
  const lifts = useQuery(api.lifts.getLifts, { userId });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addLift({ exercise, weight, reps, sets, date, userId });
      setExercise("");
      setWeight(0);
      setReps(0);
      setSets(0);
      setDate("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Gym Tracker</h1>
            <p className="text-muted-foreground text-lg">
              Track your lifts and monitor your progress
            </p>
          </div>

          {/* Log Lift Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Log a Lift</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exercise">Exercise</Label>
                    <Input
                      id="exercise"
                      type="text"
                      placeholder="Bench Press"
                      value={exercise}
                      onChange={e => setExercise(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="90"
                      value={weight || ""}
                      onChange={e => setWeight(Number(e.target.value))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reps">Reps</Label>
                    <Input
                      id="reps"
                      type="number"
                      placeholder="8"
                      value={reps || ""}
                      onChange={e => setReps(Number(e.target.value))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sets">Sets</Label>
                    <Input
                      id="sets"
                      type="number"
                      placeholder="3"
                      value={sets || ""}
                      onChange={e => setSets(Number(e.target.value))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    {loading ? "Logging..." : "Log Lift"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lifts History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Lift History</CardTitle>
            </CardHeader>
            <CardContent>
              {!lifts ? (
                <div className="text-center py-8">
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/4 mx-auto mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/6 mx-auto"></div>
                  </div>
                </div>
              ) : lifts.length === 0 ? (
                <div className="text-center py-12">
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
                  <h3 className="text-lg font-semibold mb-2">No lifts logged yet</h3>
                  <p className="text-muted-foreground">
                    Start by logging your first lift above!
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Exercise</TableHead>
                        <TableHead className="text-right">Weight (kg)</TableHead>
                        <TableHead className="text-right">Reps</TableHead>
                        <TableHead className="text-right">Sets</TableHead>
                        <TableHead className="text-right">1RM (kg)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lifts.map((lift: any) => (
                        <TableRow key={lift._id}>
                          <TableCell className="font-medium">
                            {new Date(lift.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{lift.exercise}</TableCell>
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
