<template>
  <nav :aria-label="$t('a11y.breadcrumb')">
    <ol class="flex flex-wrap items-center gap-1 text-small font-semibold text-ink-soft">
      <li v-for="(item, index) in items" :key="item.to" class="flex items-center gap-1">
        <ChevronRightIcon
          v-if="index > 0"
          class="h-icon-sm w-icon-sm shrink-0 text-ink-subtle rtl:rotate-180"
          aria-hidden="true"
        />
        <!-- The last crumb is the current page: rendered as text, and marked with
             aria-current so it is announced as the location rather than a link. -->
        <span
          v-if="index === items.length - 1"
          class="inline-flex min-h-11 items-center text-ink"
          aria-current="page"
        >
          {{ item.label }}
        </span>
        <NuxtLink
          v-else
          :to="item.to"
          class="focus-ring inline-flex min-h-11 items-center rounded-control transition-colors hover:text-brand-primary"
        >
          {{ item.label }}
        </NuxtLink>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { ChevronRightIcon } from 'lucide-vue-next'

defineProps<{
  items: { label: string; to: string }[]
}>()
</script>
