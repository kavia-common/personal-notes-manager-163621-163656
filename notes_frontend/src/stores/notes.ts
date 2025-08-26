import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type Note = {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

type SortBy = 'updated' | 'title'

const STORAGE_KEY = (import.meta.env.VITE_STORAGE_KEY as string) || 'notes_app_storage_v1'
const DEFAULT_SORT: SortBy = (import.meta.env.VITE_DEFAULT_SORT as SortBy) || 'updated'

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<Note[]>([])
  const search = ref<string>('')
  const activeTag = ref<string | null>(null)
  const sortBy = ref<SortBy>(DEFAULT_SORT)

  function persist() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ notes: notes.value, sortBy: sortBy.value }),
      )
    } catch {
      // Ignore storage errors (e.g., quota)
    }
  }

  // PUBLIC_INTERFACE
  function loadFromStorage(): void {
    /** Load notes and preferences from localStorage using configured key. */
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw)
      notes.value = Array.isArray(parsed.notes) ? parsed.notes : []
      sortBy.value = (parsed.sortBy === 'title' || parsed.sortBy === 'updated') ? parsed.sortBy : DEFAULT_SORT
    } catch {
      // ignore malformed data
    }
  }

  // PUBLIC_INTERFACE
  function createNote(): Note {
    /** Create a new note with sane defaults and persist it. */
    const now = Date.now()
    const newNote: Note = {
      id: uid(),
      title: 'Untitled',
      content: '',
      tags: [],
      createdAt: now,
      updatedAt: now,
    }
    notes.value.unshift(newNote)
    persist()
    return newNote
  }

  // PUBLIC_INTERFACE
  function updateNote(id: string, payload: Partial<Pick<Note, 'title' | 'content' | 'tags'>>): void {
    /** Update an existing note by id with provided fields and persist. */
    const idx = notes.value.findIndex((n) => n.id === id)
    if (idx === -1) return
    const existing = notes.value[idx]
    const updated: Note = {
      ...existing,
      ...payload,
      updatedAt: Date.now(),
    }
    notes.value.splice(idx, 1, updated)
    persist()
  }

  // PUBLIC_INTERFACE
  function deleteNote(id: string): void {
    /** Delete a note by id and persist. */
    notes.value = notes.value.filter((n) => n.id !== id)
    persist()
  }

  // PUBLIC_INTERFACE
  function setSearch(q: string): void {
    /** Set the search query string used for filtering. */
    search.value = q
  }

  // PUBLIC_INTERFACE
  function setActiveTag(tag: string | null): void {
    /** Set or clear the active tag filter. */
    activeTag.value = tag
  }

  // PUBLIC_INTERFACE
  function clearFilters(): void {
    /** Clear both search and tag filters. */
    search.value = ''
    activeTag.value = null
  }

  // PUBLIC_INTERFACE
  function setSortBy(s: SortBy): void {
    /** Set sorting preference and persist the preference. */
    sortBy.value = s
    persist()
  }

  const allTags = computed<string[]>(() => {
    const set = new Set<string>()
    for (const n of notes.value) for (const t of n.tags) set.add(t)
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  })

  const filteredAndSortedNotes = computed<Note[]>(() => {
    const q = search.value.trim().toLowerCase()
    const tag = activeTag.value?.toLowerCase() || null

    let res = notes.value.filter((n) => {
      const matchesTag = !tag || n.tags.map((t) => t.toLowerCase()).includes(tag)
      if (!matchesTag) return false
      if (!q) return true
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
      )
    })

    res = res.slice().sort((a, b) => {
      if (sortBy.value === 'title') return a.title.localeCompare(b.title)
      return b.updatedAt - a.updatedAt
    })
    return res
  })

  return {
    notes,
    search,
    activeTag,
    sortBy,

    allTags,
    filteredAndSortedNotes,

    loadFromStorage,
    createNote,
    updateNote,
    deleteNote,
    setSearch,
    setActiveTag,
    clearFilters,
    setSortBy,
  }
})
