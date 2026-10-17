# Finish Music

Finish Music is a TypeScript/Vite music-production tracker. Its original Finish Room experience is preserved: stage workflows and task checklists, project to-dos and notes, the all-tracks list grouped by status, track opening and confirmed deletion, MP3 indicator/player/timestamp notes, editable arrangement/mix/mastered versions, Original/Remix and release-type selections, BPM/key/genre metadata, and square track artwork.

## Stack

- TypeScript + Vite for the browser app
- Supabase Auth email magic links
- Supabase Postgres for track records, task progress, to-dos, notes, and metadata
- Private Supabase Storage buckets for MP3s and cover art
- IndexedDB and localStorage as local cache/offline fallback

## Supabase setup

The Finish Music schema has been provisioned in the connected Supabase project. The migration files in `supabase/migrations/` document the schema and permissions. Track rows are protected by RLS and scoped to the signed-in user. Audio and artwork buckets are private; objects are stored beneath each user's ID. Never put a Supabase service-role/secret key in this browser app.

For another environment, copy `.env.example` to `.env.local`; it is already configured with this app’s Supabase project URL and publishable key. Add `https://finish-room.steady-daisy-7179.chatgpt.site/**` under Supabase Auth's allowed redirect URLs (or set the same address as the Site URL). Email OTP/magic link delivery must be configured in Supabase Auth.

## Development

```sh
npm install
npm run dev
```

Create a production build and run the TypeScript check with:

```sh
npm run build
```

The static `index.html` is only Vite's entry shell. App layout, styles, and behavior live in `src/` TypeScript and CSS.
