import { unstable_cache } from "next/cache";
import { fallbackWorkouts } from "@/data/fallback-workouts";

const API_URL = "https://api.api-store.workers.dev/api/fitlog";

const getWorkoutLibrary = unstable_cache(
  async () => {
    const response = await fetch(API_URL, { cache: "no-store" });
    if (!response.ok) throw new Error("Workout service unavailable");

    const workouts: unknown = await response.json();
    if (!Array.isArray(workouts) || workouts.length === 0)
      throw new Error("Workout service returned invalid data");

    return workouts;
  },
  ["fitlog-workout-library"],
  { revalidate: 300 },
);

export async function GET() {
  try {
    return Response.json(await getWorkoutLibrary());
  } catch {
    return Response.json(fallbackWorkouts, {
      headers: { "x-workout-source": "fallback" },
    });
  }
}