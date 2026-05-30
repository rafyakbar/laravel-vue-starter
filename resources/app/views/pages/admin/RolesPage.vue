<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useI18n } from '@/composables/useI18n'
import BasicPage from '@/components/shared/BasicPage.vue'
import DataTable from '@/components/shared/DataTable.vue'
import type { Column } from '@/components/shared/DataTable.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import { apiGet, apiPost, apiPut, apiDelete, ApiError } from '@/services/api'
import type { Role, Permission, RolePayload } from '@/types/role'

const { t } = useI18n()

const roles = ref<Role[]>([])
const permissions = ref<Permission[]>([])
const loading = ref(false)
const search = ref('')
const pagination = ref<{
  current_page: number
  last_page: number
  total: number
  per_page: number
  from: number | null
  to: number | null
} | null>(null)

const formOpen = ref(false)
const formLoading = ref(false)
const editingRole = ref<Role | null>(null)
const formName = ref('')
const formPermissions = ref<string[]>([])
const formErrors = ref<Record<string, string[]>>({})

const deleteOpen = ref(false)
const deleteLoading = ref(false)
const deletingRole = ref<Role | null>(null)

const columns: Column[] = [
  { key: 'name', label: t('pages.roles.roleName') },
  { key: 'permissions', label: t('pages.roles.permissions') },
  { key: 'users_count', label: t('pages.roles.usersCount'), class: 'w-[100px] text-center' },
]

async function fetchRoles(page = 1) {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: String(page),
      per_page: '10',
    })
    if (search.value) {
      params.set('search', search.value)
    }
    const response = await apiGet<{
      data: Role[]
      meta: {
        current_page: number
        last_page: number
        total: number
        per_page: number
        from: number | null
        to: number | null
      }
    }>(`/api/roles?${params}`)
    roles.value = response.data
    pagination.value = response.meta
  } catch {
    roles.value = []
  } finally {
    loading.value = false
  }
}

async function fetchPermissions() {
  try {
    const response = await apiGet<{ data: Permission[] }>('/api/permissions')
    permissions.value = response.data
  } catch {
    permissions.value = []
  }
}

function openCreate() {
  editingRole.value = null
  formName.value = ''
  formPermissions.value = []
  formErrors.value = {}
  formOpen.value = true
}

async function openEdit(role: Role) {
  editingRole.value = role
  formName.value = role.name
  formPermissions.value = [...(role.permissions ?? [])]
  formErrors.value = {}
  formOpen.value = true
  
  // Wait for next tick to ensure dialog is rendered, then verify permissions are set
  await nextTick()
  console.log('Edit role permissions:', formPermissions.value)
}

function closeForm() {
  formOpen.value = false
  editingRole.value = null
}

async function saveRole() {
  formLoading.value = true
  formErrors.value = {}

  const payload: RolePayload = {
    name: formName.value,
    permissions: formPermissions.value,
  }

  try {
    if (editingRole.value) {
      await apiPut(`/api/roles/${editingRole.value.id}`, payload)
    } else {
      await apiPost('/api/roles', payload)
    }
    closeForm()
    await fetchRoles(pagination.value?.current_page ?? 1)
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      const data = error.data as { errors?: Record<string, string[]> }
      formErrors.value = data?.errors ?? {}
    }
  } finally {
    formLoading.value = false
  }
}

function togglePermission(perm: string) {
  const idx = formPermissions.value.indexOf(perm)
  if (idx === -1) {
    formPermissions.value.push(perm)
  } else {
    formPermissions.value.splice(idx, 1)
  }
}

function handlePermissionChange(perm: string, checked: boolean) {
  if (checked) {
    if (!formPermissions.value.includes(perm)) {
      formPermissions.value.push(perm)
    }
  } else {
    const idx = formPermissions.value.indexOf(perm)
    if (idx !== -1) {
      formPermissions.value.splice(idx, 1)
    }
  }
}

function openDelete(role: Role) {
  deletingRole.value = role
  deleteOpen.value = true
}

function closeDelete() {
  deleteOpen.value = false
  deletingRole.value = null
}

async function confirmDelete() {
  if (!deletingRole.value) return
  deleteLoading.value = true
  try {
    await apiDelete(`/api/roles/${deletingRole.value.id}`)
    closeDelete()
    await fetchRoles(pagination.value?.current_page ?? 1)
  } catch {
    // handle error silently
  } finally {
    deleteLoading.value = false
  }
}

function onPageChange(page: number) {
  fetchRoles(page)
}

function onSearch(value: string) {
  search.value = value
  fetchRoles(1)
}

onMounted(() => {
  fetchRoles()
  fetchPermissions()
})
</script>

<template>
  <BasicPage :title="t('pages.roles.title')" :description="t('pages.roles.description')">
    <template #actions>
      <Button @click="openCreate">
        <Plus class="h-4 w-4" />
        {{ t('pages.roles.createRole') }}
      </Button>
    </template>

    <DataTable
      :columns="columns"
      :data="roles"
      :loading="loading"
      :search="search"
      :pagination="pagination"
      :empty-text="t('common.noData')"
      @search="onSearch"
      @page-change="onPageChange"
    >
      <template #cell-name="{ item }">
        <span class="font-medium">{{ item.name }}</span>
      </template>

      <template #cell-permissions="{ item }">
        <div class="flex flex-wrap gap-1">
          <Badge v-for="perm in (item.permissions ?? []).slice(0, 3)" :key="perm" variant="secondary" class="text-xs">
            {{ perm }}
          </Badge>
          <Badge v-if="(item.permissions ?? []).length > 3" variant="outline" class="text-xs">
            +{{ (item.permissions ?? []).length - 3 }}
          </Badge>
          <span v-if="!item.permissions?.length" class="text-sm text-muted-foreground">
            {{ t('pages.roles.noPermissions') }}
          </span>
        </div>
      </template>

      <template #cell-users_count="{ item }">
        <span class="text-center block">{{ item.users_count ?? 0 }}</span>
      </template>

      <template #rowActions="{ item }">
        <div class="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" class="h-8 w-8" @click="openEdit(item)">
            <Pencil class="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" class="h-8 w-8 text-destructive" @click="openDelete(item)">
            <Trash2 class="h-4 w-4" />
          </Button>
        </div>
      </template>
    </DataTable>

    <Dialog :open="formOpen" @update:open="closeForm">
      <DialogContent class="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ editingRole ? t('pages.roles.editRole') : t('pages.roles.createRole') }}</DialogTitle>
          <DialogDescription>{{ t('pages.roles.selectPermissions') }}</DialogDescription>
        </DialogHeader>

        <div class="flex flex-col gap-4 py-4">
          <div class="flex flex-col gap-2">
            <Label for="role-name">{{ t('pages.roles.roleName') }}</Label>
            <Input
              id="role-name"
              v-model="formName"
              :placeholder="t('pages.roles.roleName')"
              :class="{ 'border-destructive': formErrors.name }"
            />
            <p v-if="formErrors.name" class="text-sm text-destructive">
              {{ formErrors.name[0] }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <Label>{{ t('pages.roles.permissions') }}</Label>
            <div class="grid grid-cols-2 gap-2 rounded-md border p-3 max-h-48 overflow-y-auto">
              <div
                v-for="perm in permissions"
                :key="perm.name"
                class="flex items-center gap-2"
              >
                <Checkbox
                  :id="`perm-${perm.name}`"
                  :model-value="formPermissions.includes(perm.name)"
                  @update:model-value="(value) => handlePermissionChange(perm.name, value as boolean)"
                />
                <Label :for="`perm-${perm.name}`" class="text-sm font-normal cursor-pointer">
                  {{ perm.name }}
                </Label>
              </div>
            </div>
            <p v-if="formErrors.permissions" class="text-sm text-destructive">
              {{ formErrors.permissions[0] }}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" :disabled="formLoading" @click="closeForm">
            {{ t('common.cancel') }}
          </Button>
          <Button :disabled="formLoading" @click="saveRole">
            {{ formLoading ? t('common.saving') : t('common.save') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <ConfirmDialog
      :open="deleteOpen"
      :title="t('pages.roles.deleteRole')"
      :description="t('pages.roles.deleteRoleConfirm')"
      :loading="deleteLoading"
      @update:open="closeDelete"
      @confirm="confirmDelete"
    />
  </BasicPage>
</template>
