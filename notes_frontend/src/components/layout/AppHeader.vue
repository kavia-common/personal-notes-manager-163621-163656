<script setup lang="ts">
import { computed } from 'vue'

// Use defineProps for typing only; don't assign to a variable to avoid unused warnings.
defineProps<{
  search: string
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'create'): void
}>()

const appName = computed(() => import.meta.env.VITE_APP_NAME || 'Notes')
</script>

<template>
  <header class="header">
    <div class="brand">
      <div class="logo">📝</div>
      <div class="title">{{ appName }}</div>
    </div>

    <div class="search panel">
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L19 20.49 20.49 19 15.5 14m-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14" />
      </svg>
      <input
        :value="search"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        type="search"
        placeholder="Search notes..."
        aria-label="Search notes"
      />
    </div>

    <div class="actions">
      <button class="btn btn-primary" @click="emit('create')">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M19 13H13v6h-2v-6H5v-2h6V5h2v6h6z" />
        </svg>
        New
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: saturate(180%) blur(8px);
  background: color-mix(in oklab, var(--bg) 92%, white 8%);
  border-bottom: 1px solid var(--border);
  display: grid;
  grid-template-columns: 1fr 600px auto;
  gap: 16px;
  align-items: center;
  padding: 12px 16px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 36px;
  height: 36px;
  background: var(--secondary);
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 18px;
}

.title {
  font-weight: 800;
  letter-spacing: 0.2px;
}

.search {
  display: grid;
  grid-template-columns: 40px 1fr;
  align-items: center;
  padding: 0 8px 0 10px;
  height: 44px;
  border-radius: 12px;
}

.search svg {
  color: var(--text-soft);
  margin-left: 4px;
}

.search input {
  border: none;
  outline: none;
  height: 100%;
  background: transparent;
}

.actions {
  display: flex;
  gap: 8px;
}

/* Responsive */
@media (max-width: 960px) {
  .header {
    grid-template-columns: 1fr;
  }
  .actions {
    order: 3;
  }
}
</style>
