"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUpDown, Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import { WorkoutCard } from "@/components/workout-card";
import type { Workout, WorkoutSort } from "@/types/workout";

const API_URL = "https://api.abcz.workers.dev/api/fitlog";

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<WorkoutSort>("Duration");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(API_URL, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error("Could not load the workout library."); return response.json() as Promise<Workout[]>; })
      .then(setWorkouts)
      .catch((reason: unknown) => { if (reason instanceof Error && reason.name !== "AbortError") setError(reason.message); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const visibleWorkouts = useMemo(() => {
    const filtered = workouts.filter((workout) => `${workout.name} ${workout.muscleGroups.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
    const key = sortBy === "Calories" ? "caloriesBurned" : sortBy.toLowerCase() as "duration" | "rating";
    return [...filtered].sort((a, b) => b[key] - a[key]);
  }, [workouts, sortBy, query]);

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy"><p className="eyebrow"><span className="eyebrow-line" />WORKOUT LIBRARY</p><h1>TRAIN WITH<br /><span>INTENT.</span> LOG<br />EVERY SET<span className="lime-period">.</span></h1><p className="hero-description">FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into today&apos;s plan, and watch the week&apos;s work add up.</p><a className="button button-primary hero-button" href="#library"><span>BROWSE WORKOUTS</span><ArrowDown size={17} /></a><div className="hero-footnote"><span className="hero-dot" /> BUILT FOR THE WORK</div></div>
          <div className="hero-visual"><div className="hero-image-frame"><Image src="https://img.magnific.com/free-photo/portrait-anime-character-doing-fitness-exercising_23-2151666664.jpg?w=740" alt="Anatomical athlete performing a barbell bench press" fill priority sizes="(max-width: 760px) 90vw, 55vw" /></div><div className="hero-image-shade" /><div className="hero-index">01 <span>/ 12</span></div><div className="hero-caption"><span className="caption-rule" /><div><strong>BARBELL BENCH PRESS</strong><small>CHEST / ARMS · 25 MIN</small></div></div><div className="hero-vertical">STRENGTH IS BUILT REP BY REP</div><div className="hero-crosshair">+</div></div>
          <div className="hero-scroll">01 <span /> SCROLL TO EXPLORE</div>
        </div>
      </section>
      <section className="library-section" id="library">
        <div className="section-topline"><span>01 / TRAINING INDEX</span><span>12 MOVEMENTS · ALL LEVELS</span></div>
        <div className="library-heading"><div><p className="eyebrow"><span className="eyebrow-line" />THE WORK STARTS HERE</p><h2>THE <span>LIBRARY</span></h2><p className="section-subtitle">Twelve lifts covering every major muscle group.</p></div><div className="library-tools"><label className="search-control"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search lifts or muscle" aria-label="Search workouts" /></label><label className="sort-control"><ArrowUpDown size={15} /><span>SORT BY</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value as WorkoutSort)} aria-label="Sort workouts"><option>Duration</option><option>Calories</option><option>Rating</option></select></label></div></div>
        <div className="library-grid" aria-live="polite">{loading ? <div className="loading-state"><span className="loader" /><span>LOADING WORKOUTS</span></div> : error ? <div className="error-state">{error} <button onClick={() => window.location.reload()}>Try again</button></div> : visibleWorkouts.length ? visibleWorkouts.map((workout, index) => <WorkoutCard key={workout.id} workout={workout} index={index} />) : <div className="no-results"><SlidersHorizontal />No lifts match that search.</div>}</div>
        <div className="library-bottom"><span>SHOWING {visibleWorkouts.length.toString().padStart(2, "0")} MOVEMENTS</span><span>SELECT A MOVEMENT TO VIEW DETAILS <span className="bottom-arrow">↗</span></span></div>
      </section>
    </>
  );
}