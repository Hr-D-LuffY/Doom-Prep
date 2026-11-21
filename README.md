# Dooms Prep: Frontend

The React client for **Doom Prep**, an app that helps MCU fans plan a rewatch before _Avengers: Doomsday_ and book an opening-night watch party.

It talks to the Doom Prep API (Node.js, Express, PostgreSQL). The API must be running for the app to show data.

## Features

- **Movies:** add movies with a searchable prerequisite picker, edit a movie's prerequisites, tick movies as watched, and delete movies. Circular prerequisites are rejected with a clear message.
- **Rewatch Plan:** pick a target movie and see everything to watch before it, in order, with watched ticks, a progress bar ("4 of 7 watched") and the remaining time as `Xh Ym`.
- **Booking:** pick a cinema and a group size to see the fewest seat bundles that fill every seat exactly, or a clear message when no exact combination exists. Cinemas can be added from the same page.

## Tech stack

| Area          | Choice                                                                         |
| ------------- | ------------------------------------------------------------------------------ |
| UI            | React 19                                                                       |
| Language      | TypeScript (strict mode)                                                       |
| Build tool    | Vite                                                                           |
| Routing       | React Router                                                                   |
| Styling       | Tailwind CSS v4 with design tokens in `src/index.css`                          |
| Data fetching | A small typed `fetch` wrapper and a `useAsync` hook (no data-fetching library) |
| Fonts         | Barlow and Barlow Condensed (Google Fonts)                                     |

## Getting started

### Prerequisites

- Node.js 20.19 or newer
- The Doom Prep API running locally (default `http://localhost:3000`). See the backend README for setup. Running its seed script gives you the full MCU dataset and four sample cinemas.

### Install and run

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

### Environment variables

| Variable       | Description                                                                                                       | Default |
| -------------- | ----------------------------------------------------------------------------------------------------------------- | ------- |
| `VITE_API_URL` | Base address of the API for production builds, for example `https://api.example.com`. Leave empty in development. | empty   |

### Production build

```bash
npm run build      # outputs to dist/
npm run preview    # serves the build locally to check it
```

Serve the contents of `dist/` from any static host.

## How the app talks to the API

All requests go through one file, `src/api/client.ts`.

- **Development:** the Vite dev server proxies every `/api` request to `http://localhost:3000` (configured in `vite.config.ts`). The browser sees one address, so no CORS setup is needed. If your API runs on another port, change the proxy target there.
- **Production:** the client calls `${VITE_API_URL}/api`. There are two ways to make that work:
  1. Serve the frontend and the API from the same address (for example with a reverse proxy that sends `/api` to the backend) and leave `VITE_API_URL` empty.
  2. Host them on different addresses, set `VITE_API_URL`, and enable CORS on the API for the frontend's origin.
- **Errors:** every failed request becomes an `ApiError` with the HTTP status and the API's error `code`. Screens use the code to show clear messages, for example `CIRCULAR_DEPENDENCY` and `DUPLICATE_TITLE`. A network failure becomes a readable "Cannot reach the server" message.
- **Typed functions:** components never call `fetch` directly. `movies.api.ts` and `cinemas.api.ts` expose one typed function per endpoint.

## Project structure

```
.
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   ├── api.interface.ts          # API error body type
│   │   ├── client.ts                 # fetch wrapper and ApiError
│   │   ├── movies.api.ts
│   │   └── cinemas.api.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx         # header, navigation, skip link
│   │   │   └── DoomsdayCountdown.tsx
│   │   └── ui/                       # shared building blocks
│   │       ├── Button.tsx
│   │       ├── EmptyState.tsx
│   │       ├── ErrorMessage.tsx
│   │       ├── FilmStrip.tsx
│   │       ├── FormField.tsx
│   │       ├── PageHeader.tsx
│   │       ├── ProgressBar.tsx
│   │       ├── Spinner.tsx
│   │       ├── WatchToggle.tsx
│   │       └── fieldStyles.ts
│   ├── features/
│   │   ├── movies/
│   │   │   ├── movie.interface.ts    # all types for the feature
│   │   │   ├── movie.validation.ts   # form checks that mirror the API rules
│   │   │   ├── MoviesPage.tsx
│   │   │   ├── MovieList.tsx
│   │   │   ├── MovieFrame.tsx
│   │   │   ├── MovieForm.tsx
│   │   │   ├── MovieEditDialog.tsx
│   │   │   └── PrerequisitePicker.tsx
│   │   ├── rewatch/
│   │   │   ├── rewatch.interface.ts
│   │   │   ├── RewatchPage.tsx
│   │   │   ├── RewatchPlanView.tsx
│   │   │   ├── RewatchFrame.tsx
│   │   │   └── updatePlanWatched.ts
│   │   └── booking/
│   │       ├── cinema.interface.ts
│   │       ├── cinema.validation.ts
│   │       ├── BookingPage.tsx
│   │       ├── BookingPanel.tsx
│   │       ├── BookingResult.tsx
│   │       ├── BundleStub.tsx
│   │       └── CinemaForm.tsx
│   ├── hooks/
│   │   ├── useAsync.ts               # loading, error, reload and local update
│   │   └── usePageTitle.ts
│   ├── pages/
│   │   └── NotFoundPage.tsx
│   ├── utils/
│   │   ├── formatDuration.ts
│   │   ├── formatList.ts
│   │   ├── getErrorMessage.ts
│   │   └── pluralize.ts
│   ├── App.tsx                       # routes
│   ├── main.tsx
│   ├── index.css                     # design tokens and global styles
│   └── env.d.ts
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Each feature folder keeps its types in a `*.interface.ts` file, its page and components next to it, and its form checks in a `*.validation.ts` file.

## Design

The interface is built around the subject, a movie marathon. The movie list and rewatch plan are a strip of film: unwatched movies are dark frames, and ticking one "develops" it into a light frame, so the strip fills with light as you work through the rewatch. Booking results are ticket stubs. Colors, fonts and spacing are defined once as tokens in `src/index.css`.

The layout is responsive down to small phones, keyboard focus is always visible, a skip link jumps to the main content, and animation respects the `prefers-reduced-motion` setting.

## Assumptions and design decisions

1. **The API is the source of truth.** The forms check the same limits as the API (title up to 200 characters, release year 1900 to 2100, runtime 1 to 300, cinema name up to 100 characters, 1 to 10 distinct bundle sizes each from 1 to 500, group size 1 to 10,000) so people get instant feedback, but the API still validates everything.
2. **The screen changes only after the server confirms.** Ticking a movie, saving prerequisites and deleting wait for a successful response, so the UI never shows a change the server rejected.
3. **Saving prerequisites replaces the whole list.** This matches the API. A movie cannot be chosen as its own prerequisite in the picker, and the API's `CIRCULAR_DEPENDENCY` response is turned into a message that explains what to change. Nothing is saved when it happens.
4. **Deleting a movie also removes it from other movies' prerequisite lists**, as the API does. The confirmation step says how many movies depend on it.
5. **The Rewatch Plan opens on "Avengers: Doomsday"** when a movie with that title exists, otherwise on the last movie in the list. Ticking a movie in the plan updates the totals on screen without reloading the plan.
6. **Booking results are tied to the cinema they were requested for.** Changing the cinema or the group size clears the old result.
7. **The Doomsday countdown uses a fixed date**, December 18, 2026, set as a constant in `DoomsdayCountdown.tsx`.
8. **Fonts load from Google Fonts**, so the first load needs internet access. System fonts are used as a fallback.
9. Authentication, pagination and offline support are out of scope.

## How I used AI tools

AI tools were used in this project, as the brief allows. This section describes how.

**Tool:** Claude

**What I used it for**

- **Planning:** discussing the frontend commit breakdown, folder structure and which pieces to share between views.
- **Code drafting:** Claude drafted the React and TypeScript for the components, the `useAsync` hook, the API layer, the form validation and the styling.
- **Visual design:** Claude proposed the film-strip and ticket-stub design direction, the color palette and the typography after I asked for a more distinctive look than my first version.
- **Documentation:** drafting this README.
