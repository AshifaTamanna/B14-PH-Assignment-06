import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">
        <span className="eyebrow-line" />
        404 / PAGE NOT FOUND
      </p>
      <h1>
        WRONG
        <br />
        TURN.
      </h1>
      <p className="section-subtitle">
        This page isn&apos;t part of the training plan.
      </p>
      <Link className="button button-primary" href="/">
        <ArrowLeft size={16} /> BACK TO FITLOG
      </Link>
    </section>
  );
}
