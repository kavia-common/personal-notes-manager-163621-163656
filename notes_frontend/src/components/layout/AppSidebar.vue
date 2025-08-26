<script setup lang="ts">
defineProps<{
  allTags: string[]
  activeTag: string | null
  activeSort: 'updated' | 'title'
}>()

const emit = defineEmits<{
  (e: 'filter:tag', tag: string | null): void
  (e: 'filter:clear'): void
  (e: 'sort', value: 'updated' | 'title'): void
}>()
</script>

<template>
  <aside class="sidebar">
    <div class="panel block">
      <div class="block-title">Filters</div>
      <div class="tags">
        <button
          class="tag"
          :class="{ active: activeTag === null }"
          @click="emit('filter:tag', null)"
        >
          All
        </button>
        <button
          v-for="tag in allTags"
          :key="tag"
          class="tag"
          :class="{ active: activeTag === tag }"
          @click="emit('filter:tag', tag)"
        >
          #{{ tag }}
        </button>
      </div>
      <div class="block-actions">
        <button class="icon-btn" title="Clear filters" @click="emit('filter:clear')">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M19 13H5v-2h14z" />
          </svg>
        </button>
      </div>
    </div>

    <div class="panel block">
      <div class="block-title">Sort by</div>
      <div class="sort-opts">
        <label class="sort-item">
          <input
            type="radio"
            name="sort"
            value="updated"
            :checked="activeSort === 'updated'"
            @change="emit('sort', 'updated')"
          />
          Updated
        </label>
        <label class="sort-item">
          <input
            type="radio"
            name="sort"
            value="title"
            :checked="activeSort === 'title'"
            @change="emit('sort', 'title')"
          />
          Title
        </label>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  padding: 16px;
  background: color-mix(in oklab, var(--bg) 96%, #f4f6f8 4%);
  border-right: 1px solid var(--border);
}

.block {
  padding: 14px;
  border-radius: var(--radius);
  margin-bottom: 16px;
}

.block-title {
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--text-soft);
  letter-spacing: 0.2px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: #fff;
  font-size: 13px;
}

.tag.active {
  background: color-mix(in oklab, var(--primary) 12%, #fff 88%);
  border-color: var(--primary);
  color: var(--primary);
  font-weight: 700;
}

.block-actions {
  margin-top: 10px;
}

.sort-opts {
  display: grid;
  gap: 8px;
}

.sort-item {
  display: grid;
  grid-template-columns: 18px 1fr;
  gap: 8px;
  align-items: center;
}

/* Responsive */
@media (max-width: 960px) {
  .sidebar {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
}
</style>
