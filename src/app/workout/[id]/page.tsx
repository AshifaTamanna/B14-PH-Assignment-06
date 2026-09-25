"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookmarkPlus, Check, Plus } from "lucide-react";
import { useFitlog } from "@/context/fitlog-context";
import type { Workout } from "@/types/workout";

export default function WorkoutDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { plan, saved, addToPlan, saveWorkout } = useFitlog();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://api.abcz.workers.dev/api/fitlog/${id}`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("Workout not found"); return response.json() as Promise<Workout>; })
      .then(setWorkout)
      .catch((reason: unknown) => { if (reason instanceof Error && reason.name !== "AbortError") setInvalid(true); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  if (loading) return <section className="detail-loading"><span className="loader" /><p>LOADING WORKOUT</p></section>;
  if (invalid || !workout) return <section className="not-found"><p className="eyebrow"><span className="eyebrow-line" />404 / MOVEMENT NOT FOUND</p><h1>THAT LIFT<br />ISN&apos;T HERE.</h1><Link className="button button-primary" href="/#library">BACK TO THE LIBRARY</Link></section>;

  const isPlanned = plan.some((item) => item.id === workout.id);
  const isSaved = saved.some((item) => item.id === workout.id);
  const atCapacity = plan.length >= 5;

  return (
    <section className="detail-page">
      <div className="detail-layout">
        <div className="detail-visual"><Image src={workout.image} alt={`${workout.name} workout illustration`} fill priority sizes="(max-width: 600px) 100vw, 48vw" /></div>
        <div className="detail-content">
          <h1>{workout.name}</h1>
          <p className="detail-description">{workout.description}</p>
          <div className="tag-row detail-tags">{workout.muscleGroups.map((group) => <span className="tag" key={group}>{group}</span>)}</div>
          <div className="specs-block"><dl className="spec-grid"><div><dt>EQUIPMENT</dt><dd>{workout.equipment}</dd></div><div><dt>DIFFICULTY</dt><dd>{workout.difficulty}</dd></div><div><dt>SETS</dt><dd>{workout.sets}</dd></div><div><dt>REPS</dt><dd>{workout.reps}</dd></div><div><dt>DURATION</dt><dd>{workout.duration} min</dd></div><div><dt>CALORIES</dt><dd>{workout.caloriesBurned} kcal</dd></div><div><dt>RATING</dt><dd>{workout.rating.toFixed(1)}</dd></div></dl></div>
          <div className="instructions-block"><div className="detail-section-label"><span>INSTRUCTIONS</span><span>04 STEPS</span></div><ol>{workout.instructions.map((instruction, index) => <li key={instruction}><span>{String(index + 1).padStart(2, "0")}</span><p>{instruction}</p></li>)}</ol></div>
          <div className="detail-actions"><button className="button button-primary" onClick={() => addToPlan(workout)} disabled={isPlanned || atCapacity}><span>{isPlanned ? <><Check size={16} /> IN TODAY&apos;S PLAN</> : atCapacity ? "PLAN IS FULL" : <><Plus size={17} /> ADD TO TODAY&apos;S PLAN</>}</span></button><button className="button button-outline" onClick={() => saveWorkout(workout)} disabled={isSaved}>{isSaved ? <><Check size={16} /> SAVED FOR LATER</> : <><BookmarkPlus size={16} /> SAVE FOR LATER</>}</button></div>
          {atCapacity && !isPlanned && <p className="capacity-note">Your plan holds five lifts. Remove or finish one to make room.</p>}
        </div>
      </div>
    </section>
  );
}