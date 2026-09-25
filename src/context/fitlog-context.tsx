"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Workout } from "@/types/workout";

type FitlogContextValue = {
  plan: Workout[];
  saved: Workout[];
  done: number[];
  hydrated: boolean;
  toast: string;
  addToPlan: (workout: Workout) => void;
  saveWorkout: (workout: Workout) => void;
  removeFromPlan: (id: number) => void;
  removeSaved: (id: number) => void;
  toggleDone: (id: number) => void;
  notify: (message: string) => void;
};

const FitlogContext = createContext<FitlogContextValue | null>(null);
const STORAGE_KEY = "fitlog-state-v1";

export function FitlogProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const value = JSON.parse(stored) as { plan?: Workout[]; saved?: Workout[]; done?: number[] };
          setPlan(value.plan ?? []);
          setSaved(value.saved ?? []);
          setDone(value.done ?? []);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify({ plan, saved, done }));
  }, [plan, saved, done, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const notify = (message: string) => setToast(message);
  const addToPlan = (workout: Workout) => {
    if (plan.some((item) => item.id === workout.id)) return notify("This lift is already in today's plan");
    if (plan.length >= 5) return notify("Today's plan is full. Finish a lift to add another.");
    setPlan((current) => [...current, workout]);
    notify("Added to today's plan");
  };
  const saveWorkout = (workout: Workout) => {
    if (saved.some((item) => item.id === workout.id)) return notify("This lift is already saved");
    setSaved((current) => [...current, workout]);
    notify("Saved for later");
  };
  const removeFromPlan = (id: number) => {
    setPlan((current) => current.filter((item) => item.id !== id));
    setDone((current) => current.filter((item) => item !== id));
    notify("Removed from today's plan");
  };
  const removeSaved = (id: number) => {
    setSaved((current) => current.filter((item) => item.id !== id));
    notify("Removed from saved lifts");
  };
  const toggleDone = (id: number) => {
    const wasDone = done.includes(id);
    setDone((current) => wasDone ? current.filter((item) => item !== id) : [...current, id]);
    notify(wasDone ? "Lift marked as not done" : "Lift marked as done");
  };

  return (
    <FitlogContext.Provider value={{ plan, saved, done, hydrated, toast, addToPlan, saveWorkout, removeFromPlan, removeSaved, toggleDone, notify }}>
      {children}
    </FitlogContext.Provider>
  );
}

export function useFitlog() {
  const context = useContext(FitlogContext);
  if (!context) throw new Error("useFitlog must be used within FitlogProvider");
  return context;
}