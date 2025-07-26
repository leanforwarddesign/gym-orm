"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import styles from "./page.module.css";

function calculate1RM(weight: number, reps: number) {
  // Epley formula
  return Math.round(weight * (1 + reps / 30));
}

export default function Home() {
  // Form state
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState(0);
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
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Log a Lift</h1>
        <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
          <input
            type="text"
            placeholder="Exercise"
            value={exercise}
            onChange={e => setExercise(e.target.value)}
            required
            style={{ marginRight: 8 }}
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            value={weight}
            onChange={e => setWeight(Number(e.target.value))}
            required
            style={{ marginRight: 8, width: 100 }}
          />
          <input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={e => setReps(Number(e.target.value))}
            required
            style={{ marginRight: 8, width: 60 }}
          />
          <input
            type="number"
            placeholder="Sets"
            value={sets}
            onChange={e => setSets(Number(e.target.value))}
            required
            style={{ marginRight: 8, width: 60 }}
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            style={{ marginRight: 8 }}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Logging..." : "Log Lift"}
          </button>
        </form>

        <h2>Logged Lifts</h2>
        {!lifts ? (
          <p>Loading...</p>
        ) : lifts.length === 0 ? (
          <p>No lifts logged yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Exercise</th>
                <th>Weight (kg)</th>
                <th>Reps</th>
                <th>Sets</th>
                <th>1RM (kg)</th>
              </tr>
            </thead>
            <tbody>
              {lifts.map((lift: any) => (
                <tr key={lift._id}>
                  <td>{lift.date}</td>
                  <td>{lift.exercise}</td>
                  <td>{lift.weight}</td>
                  <td>{lift.reps}</td>
                  <td>{lift.sets}</td>
                  <td>{calculate1RM(lift.weight, lift.reps)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
