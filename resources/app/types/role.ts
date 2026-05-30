export interface Role {
  id: number
  name: string
  permissions?: string[]
  users_count?: number | null
  created_at?: string | null
  updated_at?: string | null
}

export interface Permission {
  id: number
  name: string
}

export interface RolePayload {
  name: string
  permissions?: string[]
}
