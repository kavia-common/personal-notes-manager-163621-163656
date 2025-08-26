# Notes Frontend (Vue 3 + Vite)

A modern, minimalistic notes manager. Features:
- Create, view, edit, and delete notes
- Search and filter by tag
- Sort by last updated or title
- Responsive UI for mobile and desktop
- Light theme with brand colors (primary: #1a73e8, accent: #ffb300, secondary: #e8eaed)

## Quick start
1) Install deps
   npm install

2) Run dev server
   npm run dev

3) Build for production
   npm run build

## Environment variables
Set these in your `.env` at project root (do not commit secrets):
- VITE_APP_NAME: App title (default: "Notes")
- VITE_STORAGE_KEY: localStorage key (default: "notes_app_storage_v1")
- VITE_DEFAULT_SORT: "updated" | "title" (default: "updated")

Example:
VITE_APP_NAME="My Notes"
VITE_STORAGE_KEY="my_notes_app_v1"
VITE_DEFAULT_SORT="updated"

## Project structure
- src/stores/notes.ts: Pinia store with CRUD, search/filter, sorting, persistence
- src/components/layout: Header and Sidebar
- src/components/notes: NotesList and NoteEditor (modal)
- src/App.vue: Layout composition
- src/assets/theme.css: Theme and utility classes

The app persists notes in localStorage for simplicity and can later be switched to a backend API without changing the UI components significantly.
