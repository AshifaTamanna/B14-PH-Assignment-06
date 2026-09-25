import Image from "next/image";
import Link from "next/link";
import { Clock3, Flame, Star } from "lucide-react";
import type { Workout } from "@/types/workout";

export function WorkoutCard({ workout, index = 0 }: { workout: Workout; index?: number }) {
  return (
    <Link className="workout-card" href={`/workout/${workout.id}`} style={{ animationDelay: `${Math.min(index, 11) * 45}ms` }}>
      <div className="workout-image-wrap">
        <Image className="workout-image" src={workout.image} alt={`${workout.name} illustration`} fill sizes="(max-width: 640px) 92vw, (max-width: 1000px) 45vw, 30vw" />
        <span className="card-number">{String(workout.id).padStart(2, "0")}</span>
        <span className="image-arrow" aria-hidden="true">↗</span>
      </div>
      <div className="workout-card-body">
        <div className="tag-row">{workout.muscleGroups.map((group) => <span className="tag" key={group}>{group}</span>)}</div>
        <h3>{workout.name}</h3>
        <p className="equipment-line">{workout.equipment}</p>
        <div className="card-stats"><span><Clock3 />{workout.duration} min</span><span><Flame />{workout.caloriesBurned} kcal</span><span><Star />{workout.rating.toFixed(1)}</span></div>
      </div>
    </Link>
  );
}