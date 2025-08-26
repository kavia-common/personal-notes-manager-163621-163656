<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Note } from '@/stores/notes'

const props = defineProps<{
  note: Note
}>()

const emit = defineEmits<{
  (e: 'save', payload: { id: string; title: string; content: string; tags: string[] }): void
  (e: 'close'): void
  (e: 'delete', id: string): void
}>()

const title = ref(props.note.title)
const content = ref(props.note.content)
const tagsInput = ref(props.note.tags.join(', '))

watch(
  () => props.note,
  (n) => {
    title.value = n.title
    content.value = n.content
    tagsInput.value = n.tags.join(', ')
  },
)

function parseTags(s: string): string[] {
  return s
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((t) => t.replace(/^#/, ''))
}

function save() {
  emit('save', {
    id: props.note.id,
    title: title.value.trim() || 'Untitled',
    content: content.value,
    tags: parseTags(tagsInput.value),
  })
}

function close() {
  emit('close')
}

function onDelete() {
  emit('delete', props.note.id)
  emit('close')
}

onMounted(() => {
  // Focus the title when editor opens
  setTimeout(() => {
    const el = document.getElementById('note-title-input') as HTMLInputElement | null
    el?.focus()
    el?.select()
  }, 0)
})
</script>

<template>
  <div class="overlay" @click.self="close">
    <div class="modal panel" role="dialog" aria-modal="true" aria-label="Edit note">
      <div class="modal-header">
        <div class="left">
          <button class="icon-btn" title="Close" @click="close" aria-label="Close editor">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="right">
          <button class="btn" title="Delete" @click="onDelete">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6zm3.46-8.88l1.42-1.42L12 9.17l1.12-1.12l1.42 1.42L13.41 10.6l1.13 1.13l-1.42 1.41L12 12l-1.12 1.13l-1.42-1.41l1.13-1.13zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
            Delete
          </button>
          <button class="btn btn-primary" @click="save">Save</button>
        </div>
      </div>

      <div class="fields">
        <input
          id="note-title-input"
          class="title"
          v-model="title"
          type="text"
          placeholder="Note title"
        />
        <textarea
          class="content"
          v-model="content"
          placeholder="Write your note here..."
          rows="10"
        />
        <div class="tags-row">
          <label for="tags">Tags</label>
          <input
            id="tags"
            class="tags"
            v-model="tagsInput"
            type="text"
            placeholder="e.g. work, personal"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: color-mix(in oklab, black 16%, transparent 84%);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 50;
}

.modal {
  width: min(880px, 100%);
  max-height: 90vh;
  overflow: auto;
  border-radius: 16px;
  box-shadow: var(--shadow-md);
}

.modal-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--panel);
  z-index: 1;
}
.modal-header .left { display: flex; gap: 8px; }
.modal-header .right { display: flex; gap: 8px; }

.fields {
  padding: 16px;
  display: grid;
  gap: 12px;
}

.title {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  font-weight: 800;
  font-size: 18px;
}

.content {
  width: 100%;
  min-height: 280px;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 12px 14px;
  resize: vertical;
  line-height: 1.6;
}

.tags-row {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 10px;
  align-items: center;
}

.tags-row label {
  color: var(--text-soft);
}

.tags {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 12px;
}
</style>
