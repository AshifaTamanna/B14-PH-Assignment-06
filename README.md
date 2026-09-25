# FitLog

FitLog is a responsive workout library and daily training log. Browse twelve strength and conditioning movements, inspect detailed instructions, build a five-lift plan, and keep a separate saved list.

## Technologies

- Next.js App Router and React
- TypeScript
- Tailwind CSS 4 with custom responsive styling
- Lucide icons
- FitLog REST API
- Browser localStorage for the plan, saved lifts, and completion state

## Features

- API-backed library with search and sorting by duration, calories, or rating
- Individual workout pages with equipment, sets, reps, stats, and instructions
- Today's Plan with a five-exercise cap and live exercise, minute, and calorie totals
- Saved-for-later list, mark-as-done, removal controls, and toast feedback
- Persistent plan and saved items across page reloads
- Responsive dark interface with mobile navigation and loading/empty/error states

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. For a production build, run `npm run build` and then `npm start`.
