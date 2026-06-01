<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useI18n } from '@/composables/useI18n'
import BasicPage from '@/components/shared/BasicPage.vue'
import DataTable from '@/components/shared/DataTable.vue'
import type { Column } from '@/components/shared/DataTable.vue'
import ConfirmDialog from '@/components/shared/ConfirmDialog.vue'
import UserInitials from '@/components/shared/UserInitials.vue'
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
import { Plus, Pencil, Trash2, KeyRound } from 'lucide-vue-next'
import { apiGet, apiPost, apiPut, apiDelete, ApiError } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const { t } = useI18n()
const authStore = useAuthStore()

function isCurrentUser(userId: number): boolean {
  return authStore.user?.id === userId
}

interface User {
  id: number
  name: string
  username: string
  email: string
  avatar_url?: string
  roles?: string[]
  direct_permissions?: string[]
}

interface Role {
  id: number
  name: string
}

interface Permission {
  id: number
  name: string
}

const users = ref<User[]>([])
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

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const showResetPasswordDialog = ref(false)
const formLoading = ref(false)
const deleteLoading = ref(false)
const resetPasswordLoading = ref(false)

const selectedUser = ref<User | null>(null)
const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  roles: [] as string[],
  permissions: [] as string[],
})
const formErrors = ref<Record<string, string[]>>({})
const resetPasswordForm = ref({ password: '', password_confirmation: '' })
const resetPasswordErrors = ref<Record<string, string[]>>({})

const columns = computed<Column[]>(() => [
  { key: 'avatar', label: t('pages.users.avatar'), class: 'w-[60px]' },
  { key: 'name', label: t('pages.users.name') },
  { key: 'email', label: t('pages.users.email') },
  { key: 'username', label: t('pages.users.username') },
  { key: 'roles', label: t('pages.users.roles') },
])

async function fetchUsers(page = 1) {
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
      data: User[]
      meta: {
        current_page: number
        last_page: number
        total: number
        per_page: number
        from: number | null
        to: number | null
      }
    }>(`/api/users?${params}`)
    users.value = response.data
    pagination.value = response.meta
  } catch {
    users.value = []
  } finally {
    loading.value = false
  }
}

async function fetchRoles() {
  try {
    const response = await apiGet<{ data: Role[] }>('/api/roles')
    roles.value = response.data
  } catch {
    roles.value = []
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

function openCreateDialog() {
  selectedUser.value = null
  form.value = {
    name: '',
    username: '',
    email: '',
    password: '',
    roles: [],
    permissions: [],
  }
  formErrors.value = {}
  showCreateDialog.value = true
}

async function openEditDialog(user: User) {
  selectedUser.value = user
  formErrors.value = {}

  try {
    const response = await apiGet<{ model: User }>(`/api/users/${user.id}`)
    const userData = response.model

    form.value = {
      name: userData.name,
      username: userData.username,
      email: userData.email,
      password: '',
      roles: [...(userData.roles ?? [])],
      permissions: [...(userData.direct_permissions ?? [])],
    }

    showEditDialog.value = true
    await nextTick()
  } catch {
    // handle error silently
  }
}

function openDeleteDialog(user: User) {
  selectedUser.value = user
  showDeleteDialog.value = true
}

function openResetPasswordDialog(user: User) {
  selectedUser.value = user
  resetPasswordForm.value = { password: '', password_confirmation: '' }
  resetPasswordErrors.value = {}
  showResetPasswordDialog.value = true
}

function closeCreateDialog() {
  showCreateDialog.value = false
  selectedUser.value = null
}

function closeEditDialog() {
  showEditDialog.value = false
  selectedUser.value = null
}

function closeDeleteDialog() {
  showDeleteDialog.value = false
  selectedUser.value = null
}

function closeResetPasswordDialog() {
  showResetPasswordDialog.value = false
  selectedUser.value = null
}

async function submitCreate() {
  formLoading.value = true
  formErrors.value = {}

  const payload = {
    name: form.value.name,
    username: form.value.username,
    email: form.value.email,
    password: form.value.password,
    roles: form.value.roles,
  }

  try {
    await apiPost('/api/users', payload)
    closeCreateDialog()
    await fetchUsers(pagination.value?.current_page ?? 1)
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      const data = error.data as { errors?: Record<string, string[]> }
      formErrors.value = data?.errors ?? {}
    }
  } finally {
    formLoading.value = false
  }
}

async function submitEdit() {
  if (!selectedUser.value) return

  formLoading.value = true
  formErrors.value = {}

  const payload = {
    name: form.value.name,
    username: form.value.username,
    email: form.value.email,
    roles: form.value.roles,
    permissions: form.value.permissions,
  }

  try {
    await apiPut(`/api/users/${selectedUser.value.id}`, payload)
    closeEditDialog()
    await fetchUsers(pagination.value?.current_page ?? 1)
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      const data = error.data as { errors?: Record<string, string[]> }
      formErrors.value = data?.errors ?? {}
    }
  } finally {
    formLoading.value = false
  }
}

async function submitResetPassword() {
  if (!selectedUser.value) return

  resetPasswordLoading.value = true
  resetPasswordErrors.value = {}

  try {
    await apiPut(`/api/users/${selectedUser.value.id}`, {
      name: selectedUser.value.name,
      username: selectedUser.value.username,
      email: selectedUser.value.email,
      roles: selectedUser.value.roles ?? [],
      password: resetPasswordForm.value.password,
      password_confirmation: resetPasswordForm.value.password_confirmation,
    })
    closeResetPasswordDialog()
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      const data = error.data as { errors?: Record<string, string[]> }
      resetPasswordErrors.value = data?.errors ?? {}
    }
  } finally {
    resetPasswordLoading.value = false
  }
}

async function confirmDelete() {
  if (!selectedUser.value) return

  deleteLoading.value = true
  try {
    await apiDelete(`/api/users/${selectedUser.value.id}`)
    closeDeleteDialog()
    await fetchUsers(pagination.value?.current_page ?? 1)
  } catch {
    // handle error silently
  } finally {
    deleteLoading.value = false
  }
}

function handleRoleChange(roleName: string, checked: boolean) {
  if (checked) {
    if (!form.value.roles.includes(roleName)) {
      form.value.roles.push(roleName)
    }
  } else {
    const idx = form.value.roles.indexOf(roleName)
    if (idx !== -1) {
      form.value.roles.splice(idx, 1)
    }
  }
}

function handlePermissionChange(permName: string, checked: boolean) {
  if (checked) {
    if (!form.value.permissions.includes(permName)) {
      form.value.permissions.push(permName)
    }
  } else {
    const idx = form.value.permissions.indexOf(permName)
    if (idx !== -1) {
      form.value.permissions.splice(idx, 1)
    }
  }
}

function onPageChange(page: number) {
  fetchUsers(page)
}

function onSearch(value: string) {
  search.value = value
  fetchUsers(1)
}

onMounted(() => {
  fetchUsers()
  fetchRoles()
  fetchPermissions()
})
</script>

<template>
  <BasicPage :title="t('pages.users.title')" :description="t('pages.users.description')">
    <template #actions>
      <Button @click="openCreateDialog">
        <Plus class="h-4 w-4" />
        {{ t('pages.users.createUser') }}
      </Button>
    </template>

    <DataTable
      :columns="columns"
      :data="users"
      :loading="loading"
      :search="search"
      :pagination="pagination"
      :empty-text="t('common.noData')"
      @search="onSearch"
      @page-change="onPageChange"
    >
      <template #cell-avatar="{ item }">
        <UserInitials :name="item.name" :avatar-url="item.avatar_url" size="sm" />
      </template>

      <template #cell-name="{ item }">
        <span class="font-medium">{{ item.name }}</span>
      </template>

      <template #cell-email="{ item }">
        <span class="text-sm text-muted-foreground">{{ item.email }}</span>
      </template>

      <template #cell-username="{ item }">
        <span class="text-sm">{{ item.username }}</span>
      </template>

      <template #cell-roles="{ item }">
        <div class="flex flex-wrap gap-1">
          <Badge v-for="role in (item.roles ?? [])" :key="role" variant="secondary" class="text-xs">
            {{ role }}
          </Badge>
          <span v-if="!item.roles?.length" class="text-sm text-muted-foreground">
            {{ t('pages.users.noRoles') }}
          </span>
        </div>
      </template>

      <template #rowActions="{ item }">
        <div class="flex items-center justify-end gap-1">
          <template v-if="!isCurrentUser(item.id)">
            <Button variant="ghost" size="icon" class="h-8 w-8" :title="t('pages.users.resetPassword')" @click="openResetPasswordDialog(item)">
              <KeyRound class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" class="h-8 w-8" @click="openEditDialog(item)">
              <Pencil class="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" class="h-8 w-8 text-destructive" @click="openDeleteDialog(item)">
              <Trash2 class="h-4 w-4" />
            </Button>
          </template>
        </div>
      </template>
    </DataTable>

    <!-- Create Dialog -->
    <Dialog :open="showCreateDialog" @update:open="closeCreateDialog">
      <DialogContent class="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ t('pages.users.createUser') }}</DialogTitle>
          <DialogDescription>{{ t('pages.users.createUserDescription') }}</DialogDescription>
        </DialogHeader>

        <div class="flex flex-col gap-4 py-4">
          <div class="flex flex-col gap-2">
            <Label for="create-name">{{ t('pages.users.name') }}</Label>
            <Input
              id="create-name"
              v-model="form.name"
              :placeholder="t('pages.users.name')"
              :class="{ 'border-destructive': formErrors.name }"
            />
            <p v-if="formErrors.name" class="text-sm text-destructive">
              {{ formErrors.name[0] }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <Label for="create-username">{{ t('pages.users.username') }}</Label>
            <Input
              id="create-username"
              v-model="form.username"
              :placeholder="t('pages.users.username')"
              :class="{ 'border-destructive': formErrors.username }"
            />
            <p v-if="formErrors.username" class="text-sm text-destructive">
              {{ formErrors.username[0] }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <Label for="create-email">{{ t('pages.users.email') }}</Label>
            <Input
              id="create-email"
              v-model="form.email"
              type="email"
              :placeholder="t('pages.users.email')"
              :class="{ 'border-destructive': formErrors.email }"
            />
            <p v-if="formErrors.email" class="text-sm text-destructive">
              {{ formErrors.email[0] }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <Label for="create-password">{{ t('pages.users.password') }}</Label>
            <Input
              id="create-password"
              v-model="form.password"
              type="password"
              :placeholder="t('pages.users.password')"
              :class="{ 'border-destructive': formErrors.password }"
            />
            <p v-if="formErrors.password" class="text-sm text-destructive">
              {{ formErrors.password[0] }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <Label>{{ t('pages.users.roles') }}</Label>
            <div class="grid grid-cols-2 gap-2 rounded-md border p-3 max-h-48 overflow-y-auto">
              <div
                v-for="role in roles"
                :key="role.name"
                class="flex items-center gap-2"
              >
                <Checkbox
                  :id="`create-role-${role.name}`"
                  :model-value="form.roles.includes(role.name)"
                  @update:model-value="(value) => handleRoleChange(role.name, value as boolean)"
                />
                <Label :for="`create-role-${role.name}`" class="text-sm font-normal cursor-pointer">
                  {{ role.name }}
                </Label>
              </div>
            </div>
            <p v-if="formErrors.roles" class="text-sm text-destructive">
              {{ formErrors.roles[0] }}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" :disabled="formLoading" @click="closeCreateDialog">
            {{ t('common.cancel') }}
          </Button>
          <Button :disabled="formLoading" @click="submitCreate">
            {{ formLoading ? t('common.saving') : t('common.save') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Edit Dialog -->
    <Dialog :open="showEditDialog" @update:open="closeEditDialog">
      <DialogContent class="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{{ t('pages.users.editUser') }}</DialogTitle>
          <DialogDescription>{{ t('pages.users.editUserDescription') }}</DialogDescription>
        </DialogHeader>

        <div class="flex flex-col gap-4 py-4">
          <div class="flex flex-col gap-2">
            <Label for="edit-name">{{ t('pages.users.name') }}</Label>
            <Input
              id="edit-name"
              v-model="form.name"
              :placeholder="t('pages.users.name')"
              :class="{ 'border-destructive': formErrors.name }"
            />
            <p v-if="formErrors.name" class="text-sm text-destructive">
              {{ formErrors.name[0] }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <Label for="edit-username">{{ t('pages.users.username') }}</Label>
            <Input
              id="edit-username"
              v-model="form.username"
              :placeholder="t('pages.users.username')"
              :class="{ 'border-destructive': formErrors.username }"
            />
            <p v-if="formErrors.username" class="text-sm text-destructive">
              {{ formErrors.username[0] }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <Label>{{ t('pages.users.roles') }}</Label>
            <div class="grid grid-cols-2 gap-2 rounded-md border p-3 max-h-48 overflow-y-auto">
              <div
                v-for="role in roles"
                :key="role.name"
                class="flex items-center gap-2"
              >
                <Checkbox
                  :id="`edit-role-${role.name}`"
                  :model-value="form.roles.includes(role.name)"
                  @update:model-value="(value) => handleRoleChange(role.name, value as boolean)"
                />
                <Label :for="`edit-role-${role.name}`" class="text-sm font-normal cursor-pointer">
                  {{ role.name }}
                </Label>
              </div>
            </div>
            <p v-if="formErrors.roles" class="text-sm text-destructive">
              {{ formErrors.roles[0] }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <Label>{{ t('pages.users.directPermissions') }}</Label>
            <div class="grid grid-cols-2 gap-2 rounded-md border p-3 max-h-48 overflow-y-auto">
              <div
                v-for="perm in permissions"
                :key="perm.name"
                class="flex items-center gap-2"
              >
                <Checkbox
                  :id="`edit-perm-${perm.name}`"
                  :model-value="form.permissions.includes(perm.name)"
                  @update:model-value="(value) => handlePermissionChange(perm.name, value as boolean)"
                />
                <Label :for="`edit-perm-${perm.name}`" class="text-sm font-normal cursor-pointer">
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
          <Button variant="outline" :disabled="formLoading" @click="closeEditDialog">
            {{ t('common.cancel') }}
          </Button>
          <Button :disabled="formLoading" @click="submitEdit">
            {{ formLoading ? t('common.saving') : t('common.save') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Delete Dialog -->
    <ConfirmDialog
      :open="showDeleteDialog"
      :title="t('pages.users.deleteUser')"
      :description="t('pages.users.deleteUserConfirm')"
      :loading="deleteLoading"
      @update:open="closeDeleteDialog"
      @confirm="confirmDelete"
    />

    <!-- Reset Password Dialog -->
    <Dialog :open="showResetPasswordDialog" @update:open="closeResetPasswordDialog">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{{ t('pages.users.resetPassword') }}</DialogTitle>
          <DialogDescription>{{ t('pages.users.resetPasswordDescription') }}</DialogDescription>
        </DialogHeader>

        <div class="flex flex-col gap-4 py-4">
          <div class="flex flex-col gap-2">
            <Label for="reset-password">{{ t('pages.users.newPassword') }}</Label>
            <Input
              id="reset-password"
              v-model="resetPasswordForm.password"
              type="password"
              :placeholder="t('pages.users.newPassword')"
              :class="{ 'border-destructive': resetPasswordErrors.password }"
            />
            <p v-if="resetPasswordErrors.password" class="text-sm text-destructive">
              {{ resetPasswordErrors.password[0] }}
            </p>
          </div>

          <div class="flex flex-col gap-2">
            <Label for="reset-password-confirm">{{ t('pages.users.confirmPassword') }}</Label>
            <Input
              id="reset-password-confirm"
              v-model="resetPasswordForm.password_confirmation"
              type="password"
              :placeholder="t('pages.users.confirmPassword')"
              :class="{ 'border-destructive': resetPasswordErrors.password_confirmation }"
            />
            <p v-if="resetPasswordErrors.password_confirmation" class="text-sm text-destructive">
              {{ resetPasswordErrors.password_confirmation[0] }}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" :disabled="resetPasswordLoading" @click="closeResetPasswordDialog">
            {{ t('common.cancel') }}
          </Button>
          <Button :disabled="resetPasswordLoading" @click="submitResetPassword">
            {{ resetPasswordLoading ? t('common.saving') : t('pages.users.resetPassword') }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </BasicPage>
</template>
