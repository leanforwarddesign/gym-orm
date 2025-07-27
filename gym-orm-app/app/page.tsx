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
import { Plus, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

function calculate1RM(weight: number, reps: number) {
  // Epley formula
  return Math.round(weight * (1 + reps / 30));
}

export default function Home() {
  // Form state
  const [exercise, setExercise] = useState("Bench Press");
  const [weight, setWeight] = useState(90);
  const [reps, setReps] = useState(8);
  const [sets, setSets] = useState(3);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  // Placeholder userId (replace with real auth later)
  const userId = "demo-user";

  // Convex hooks
  const addLift = useMutation(api.lifts.addLift);
  const lifts = useQuery(api.lifts.getLifts, { userId });
  const deleteLift = useMutation(api.lifts.deleteLift);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addLift({ exercise, weight, reps, sets, date, userId });
      setExercise("Bench Press");
      setWeight(90);
      setReps(8);
      setSets(3);
      setDate(new Date().toISOString().split('T')[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteLift({ id });
  };

  const chestAndShoulders = [
    "Bench Press",
    "Incline Bench Press",
    "Overhead Press",
    "Lateral Raise",
    "Chest Fly",
  ];

  const backAndBiceps = [
    "Bent Over Rows",
    "Lat Pulldown",
    "T-bar Row",
    "Bicep Curls",
    "Hammer Curls",
    "Barbell Curls",
    "Forearm Curls",
  ];

  const legs = [
    "Squats",
    "Deadlifts",
    "Leg Press",
    "Leg Extension",
    "Leg Curl",
    "Calf Raises",
    "Glute Bridges",
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen">
    <div className="ml-10 min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Gym Tracker</h1>
            <p className="text-muted-foreground text-lg">
              Track your lifts and monitor your progress
            </p>
          </div>
          <Card className="px-4 py-4">
            <CardHeader>
              <CardTitle className="text-2xl">Log a Lift</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exercise">Exercise</Label>
                    <div className="relative">
                      <Input
                        id="exercise"
                        type="text"
                        value={exercise}
                        onChange={e => setExercise(e.target.value)}
                        placeholder="Enter or select exercise"
                        required
                        className="pr-10"
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                            type="button"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setExercise("Bench Press")}>Bench Press</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setExercise("Squats")}>Squats</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setExercise("Deadlifts")}>Deadlifts</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setExercise("Overhead Press")}>Overhead Press</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setExercise("Barbell Row")}>Barbell Row</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
                
                <div className="flex justify-center mt-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    size="lg"
                    className="w-full rounded-lg"
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
                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="px-6 py-4">Date</TableHead>
                        <TableHead className="px-6 py-4">Exercise</TableHead>
                        <TableHead className="text-right px-6 py-4">Weight (kg)</TableHead>
                        <TableHead className="text-right px-6 py-4">Reps</TableHead>
                        <TableHead className="text-right px-6 py-4">Sets</TableHead>
                        <TableHead className="text-right px-6 py-4">1RM (kg)</TableHead>
                        <TableHead className="text-right px-6 py-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lifts.map((lift: any) => (
                        <TableRow key={lift._id} className="hover:bg-muted/20">
                          <TableCell className="font-medium px-6 py-4">
                            {new Date(lift.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="px-6 py-4">{lift.exercise}</TableCell>
                          <TableCell className="text-right px-6 py-4">{lift.weight}</TableCell>
                          <TableCell className="text-right px-6 py-4">{lift.reps}</TableCell>
                          <TableCell className="text-right px-6 py-4">{lift.sets}</TableCell>
                          <TableCell className="text-right font-semibold px-6 py-4">
                            {calculate1RM(lift.weight, lift.reps)}
                          </TableCell>
                          <TableCell className="text-right px-6 py-4">
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(lift._id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
              )}
              <div className="flex justify-center mt-4">
                  <Button 
                    type="button" 
                    disabled={loading}
                    size="lg"
                    className="w-full rounded-lg"
                  >
                    {loading ? "Logging..." : "Submit Session"}
                  </Button>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
}
