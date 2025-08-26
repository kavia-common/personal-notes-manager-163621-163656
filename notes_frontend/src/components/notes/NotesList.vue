<script setup lang="ts">
import type { Note } from '@/stores/notes'

defineProps<{
  notes: Note[]
}>()

const emit = defineEmits<{
  (e: 'open', id: string): void
  (e: 'delete', id: string): void
}>()

function formatTime(ms: number) {
  const d = new Date(ms)
  return d.toLocaleString()
}
</script>

<template>
  <div class="list">
    <div v-if="!notes.length" class="empty panel">
      <div class="empty-title">No notes found</div>
      <div class="empty-sub">Try creating a new note or adjusting your filters.</div>
    </div>

    <div class="grid">
      <article
        v-for="n in notes"
        :key="n.id"
        class="note-card panel"
        @click="emit('open', n.id)"
        tabindex="0"
        role="button"
        @keydown.enter.prevent="emit('open', n.id)"
      >
        <div class="note-header">
          <h3 class="note-title">{{ n.title || 'Untitled' }}</h3>
          <div class="note-actions">
            <button
              class="icon-btn"
              title="Delete"
              @click.stop="emit('delete', n.id)"
              aria-label="Delete note"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zm3.46-8.88l1.42-1.42L12 9.17l1.12-1.12l1.42 1.42L13.41 10.6l1.13 1.13l-1.42 1.41L12 12l-1.12 1.13l-1.42-1.41l1.13-1.13zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="note-preview">
          {{ n.content ? n.content.slice(0, 160) : 'No content' }}
        </div>
        <div class="note-footer">
          <div class="tags">
            <span v-for="t in n.tags" :key="t" class="chip">#{{ t }}</span>
          </div>
          <div class="time">Updated {{ formatTime(n.updatedAt) }}</div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.list {
  width: 100%;
}

.empty {
  padding: 24px;
  text-align: center;
  border-radius: var(--radius);
}

.empty-title {
  font-weight: 800;
  margin-bottom: 6px;
}

.empty-sub {
  color: var(--text-soft);
}

.grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: start;
}

@media (max-width: 1200px) {
  .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 640px) {
  .grid { grid-template-columns: 1fr; }
}

.note-card {
  padding: 14px;
  border-radius: var(--radius);
  transition: transform .08s ease, box-shadow .12s ease, border-color .12s ease;
}

.note-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
  border-color: color-mix(in oklab, var(--primary) 24%, var(--border) 76%);
}

.note-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: start;
}

.note-title {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.2px;
}

.note-actions {
  display: flex;
  gap: 6px;
}

.note-preview {
  margin: 10px 0 12px 0;
  color: var(--text-soft);
  min-height: 42px;
}

.note-footer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  align-items: center;
}

.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.chip {
  font-size: 12px;
  border: 1px solid var(--border);
  padding: 2px 8px;
  border-radius: 999px;
  color: var(--text-soft);
  background: #fff;
}

.time {
  color: var(--text-soft);
  font-size: 12px;
}
</style>
