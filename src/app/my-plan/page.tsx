"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Clock3, Flame, Plus, Star, X } from "lucide-react";
import { useFitlog } from "@/context/fitlog-context";
import type { Workout, WorkoutSort } from "@/types/workout";

type PlanTab = "plan" | "saved";

function PlanWorkoutRow({ workout, isSaved, isDone, onDone, onRemove }: { workout: Workout; isSaved: boolean; isDone: boolean; onDone: () => void; onRemove: () => void }) {
  return (
    <article className={`plan-row${isDone ? " is-done" : ""}`}>
      <Link className="plan-thumb" href={`/workout/${workout.id}`}><Image src={workout.image} alt="" fill sizes="100px" /></Link>
      <div className="plan-workout-info"><div className="tag-row">{workout.muscleGroups.map((group) => <span className="tag" key={group}>{group}</span>)}</div><Link href={`/workout/${workout.id}`} className="plan-workout-title">{workout.name}</Link><p>{workout.equipment}</p><div className="card-stats"><span><Clock3 />{workout.duration} min</span><span><Flame />{workout.caloriesBurned} kcal</span><span><Star />{workout.rating.toFixed(1)}</span></div></div>
      <div className="plan-actions"><Link className="text-action" href={`/workout/${workout.id}`}>VIEW DETAILS <span>↗</span></Link>{!isSaved && <button className={isDone ? "done-button completed" : "done-button"} onClick={onDone}><Check size={15} />{isDone ? "DONE" : "MARK AS DONE"}</button>}<button className="remove-button" onClick={onRemove} aria-label={isSaved ? `Remove ${workout.name} from saved` : `Remove ${workout.name} from plan`}><X size={17} /></button></div>
    </article>
  );
}

function MyPlanContent() {
  const { plan, saved, done, hydrated, removeFromPlan, removeSaved, toggleDone } = useFitlog();
  const searchParams = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<PlanTab>("plan");
  const tab: PlanTab = searchParams.get("tab") === "saved" ? "saved" : selectedTab;
  const [sortBy, setSortBy] = useState<WorkoutSort>("Duration");
  const [query, setQuery] = useState("");

  const currentList = tab === "plan" ? plan : saved;
  const shownList = useMemo(() => {
    const key = sortBy === "Calories" ? "caloriesBurned" : sortBy.toLowerCase() as "duration" | "rating";
    return [...currentList]
      .filter((workout) => `${workout.name} ${workout.muscleGroups.join(" ")}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => b[key] - a[key]);
  }, [currentList, sortBy, query]);
  const totalMinutes = plan.reduce((total, workout) => total + workout.duration, 0);
  const totalCalories = plan.reduce((total, workout) => total + workout.caloriesBurned, 0);

  function chooseTab(nextTab: PlanTab) {
    setSelectedTab(nextTab);
    window.history.replaceState(null, "", nextTab === "saved" ? "/my-plan?tab=saved" : "/my-plan");
  }

  return (
    <section className="plan-page">
      <div className="plan-topline"><span>02 / YOUR TRAINING LOG</span><span>{new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" }).toUpperCase()}</span></div>
      <div className="plan-heading"><div><p className="eyebrow"><span className="eyebrow-line" />DAILY TRAINING LOG</p><h1>MY <span>PLAN</span></h1><p className="section-subtitle">Cap of five lifts for today. Finish them, then load more.</p></div><div className="plan-progress"><span>DAILY CAP</span><strong>{String(plan.length).padStart(2, "0")}<small> / 05</small></strong><div className="progress-track"><span style={{ width: `${Math.min(plan.length / 5 * 100, 100)}%` }} /></div></div></div>
      <div className="metrics-row"><div className="metric"><span>EXERCISES</span><strong>{String(plan.length).padStart(2, "0")}<small> / 05</small></strong><span className="metric-mark">01</span></div><div className="metric"><span>MINUTES</span><strong>{totalMinutes}<small> MIN</small></strong><span className="metric-mark">02</span></div><div className="metric"><span>CALORIES</span><strong>{totalCalories}<small> KCAL</small></strong><span className="metric-mark">03</span></div></div>
      <div className="plan-list-header"><div className="plan-tabs" role="tablist" aria-label="Workout lists"><button className={tab === "plan" ? "plan-tab selected" : "plan-tab"} onClick={() => chooseTab("plan")} role="tab" aria-selected={tab === "plan"}>TODAY&apos;S PLAN <span>{String(plan.length).padStart(2, "0")}</span></button><button className={tab === "saved" ? "plan-tab selected" : "plan-tab"} onClick={() => chooseTab("saved")} role="tab" aria-selected={tab === "saved"}>SAVED <span>{String(saved.length).padStart(2, "0")}</span></button></div><div className="plan-list-tools"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search list" aria-label="Search workouts in list" /><label className="compact-sort">SORT <select value={sortBy} onChange={(event) => setSortBy(event.target.value as WorkoutSort)} aria-label="Sort list"><option>Duration</option><option>Calories</option><option>Rating</option></select></label></div></div>
      {!hydrated ? <div className="plan-loading"><span className="loader" />LOADING WORKOUTS…</div> : shownList.length > 0 ? <div className="plan-list" role="tabpanel">{shownList.map((workout) => <PlanWorkoutRow key={workout.id} workout={workout} isSaved={tab === "saved"} isDone={done.includes(workout.id)} onDone={() => toggleDone(workout.id)} onRemove={() => tab === "saved" ? removeSaved(workout.id) : removeFromPlan(workout.id)} />)}</div> : <div className="empty-state"><span className="empty-icon"><Plus size={22} /></span><p className="eyebrow"><span className="eyebrow-line" />NOTHING HERE YET</p><h2>{tab === "saved" ? "NO SAVED LIFTS." : "LET'S GET MOVING."}</h2><p>{tab === "saved" ? "Save a movement from the library and it will be waiting here." : "Browse the library and add a lift to get today moving."}</p><Link className="button button-primary" href="/#library">GO TO WORKOUTS <span>↗</span></Link></div>}
      {hydrated && currentList.length > 0 && <div className="plan-list-footer"><span>{shownList.length} {tab === "plan" ? "LIFTS IN TODAY'S PLAN" : "SAVED MOVEMENTS"}</span><span>{tab === "plan" && plan.length < 5 ? <Link href="/#library">ADD ANOTHER LIFT <Plus size={14} /></Link> : "TRAIN WITH INTENT."}</span></div>}
    </section>
  );
}

export default function MyPlanPage() {
  return <Suspense fallback={<section className="plan-loading"><span className="loader" />LOADING WORKOUTS…</section>}><MyPlanContent /></Suspense>;
}