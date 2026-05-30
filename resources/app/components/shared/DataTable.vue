<script setup lang="ts" generic="T">
import { ref, computed } from 'vue'
import { useI18n } from '@/composables/useI18n'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft, ChevronRight, Search } from 'lucide-vue-next'

export interface Column {
  key: string
  label: string
  class?: string
}

interface PaginationMeta {
  current_page: number
  last_page: number
  total: number
  per_page: number
  from: number | null
  to: number | null
}

const props = withDefaults(
  defineProps<{
    columns: Column[]
    data: T[]
    loading?: boolean
    search?: string
    pagination?: PaginationMeta | null
    emptyText?: string
  }>(),
  {
    loading: false,
    search: '',
    pagination: null,
    emptyText: 'No data found',
  },
)

const emit = defineEmits<{
  (e: 'search', value: string): void
  (e: 'page-change', page: number): void
}>()

const { t } = useI18n()

const searchInput = ref(props.search)

function triggerSearch() {
  emit('search', searchInput.value)
}

function onSearchKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    triggerSearch()
  }
}

const canPrev = computed(() => props.pagination && props.pagination.current_page > 1)
const canNext = computed(() => props.pagination && props.pagination.current_page < props.pagination.last_page)

function prevPage() {
  if (canPrev.value && props.pagination) {
    emit('page-change', props.pagination.current_page - 1)
  }
}

function nextPage() {
  if (canNext.value && props.pagination) {
    emit('page-change', props.pagination.current_page + 1)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <div class="relative flex-1 max-w-sm">
        <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          v-model="searchInput"
          :placeholder="t('common.search')"
          class="pl-8"
          @keydown="onSearchKeydown"
        />
      </div>
      <Button variant="outline" size="icon" @click="triggerSearch">
        <Search class="h-4 w-4" />
      </Button>
      <slot name="actions" />
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead v-for="col in columns" :key="col.key" :class="col.class">
              {{ col.label }}
            </TableHead>
            <TableHead v-if="$slots.rowActions" class="w-[100px] text-right">
              {{ t('common.actions') }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="loading">
            <TableRow v-for="i in 5" :key="i">
              <TableCell v-for="col in columns" :key="col.key">
                <Skeleton class="h-4 w-full" />
              </TableCell>
              <TableCell v-if="$slots.rowActions">
                <Skeleton class="h-4 w-16 ml-auto" />
              </TableCell>
            </TableRow>
          </template>
          <template v-else-if="data.length === 0">
            <TableRow>
              <TableCell :colspan="columns.length + ($slots.rowActions ? 1 : 0)" class="h-24 text-center text-muted-foreground">
                {{ emptyText }}
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow v-for="(item, index) in data" :key="index">
              <TableCell v-for="col in columns" :key="col.key" :class="col.class">
                <slot :name="`cell-${col.key}`" :item="item" :index="index">
                  {{ (item as Record<string, unknown>)[col.key] }}
                </slot>
              </TableCell>
              <TableCell v-if="$slots.rowActions" class="text-right">
                <slot name="rowActions" :item="item" :index="index" />
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <div v-if="pagination && pagination.last_page > 1" class="flex items-center justify-between">
      <p class="text-sm text-muted-foreground">
        {{ t('common.paginationInfo', { from: pagination.from ?? 0, to: pagination.to ?? 0, total: pagination.total }) }}
      </p>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" :disabled="!canPrev" @click="prevPage">
          <ChevronLeft class="h-4 w-4" />
          {{ t('common.previous') }}
        </Button>
        <span class="text-sm text-muted-foreground">
          {{ pagination.current_page }} / {{ pagination.last_page }}
        </span>
        <Button variant="outline" size="sm" :disabled="!canNext" @click="nextPage">
          {{ t('common.next') }}
          <ChevronRight class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
