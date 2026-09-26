import { unstable_cache } from "next/cache";
import { fallbackWorkouts } from "@/data/fallback-workouts";
import type { Workout } from "@/types/workout";

const API_URL = "https://api.api-store.workers.dev/api/fitlog";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const workoutId = Number(id);
  if (!Number.isInteger(workoutId))
    return Response.json({ error: "Invalid workout id" }, { status: 400 });

  const getWorkout = unstable_cache(
    async (): Promise<Workout> => {
      const response = await fetch(`${API_URL}/${encodeURIComponent(id)}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Workout service unavailable");

      const workout: unknown = await response.json();
      if (!workout || typeof workout !== "object")
        throw new Error("Workout service returned invalid data");

      return workout as Workout;
    },
    ["fitlog-workout", id],
    { revalidate: 300 },
  );

  try {
    return Response.json(await getWorkout());
  } catch {
    const workout = fallbackWorkouts.find((item) => item.id === workoutId);
    if (!workout)
      return Response.json({ error: "Workout not found" }, { status: 404 });

    return Response.json(workout, {
      headers: { "x-workout-source": "fallback" },
    });
  }
}