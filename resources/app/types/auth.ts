export interface User {
  id: number
  name: string
  username: string
  email: string
  email_verified_at: string | null
  avatar_url: string | null
  avatar_thumb_url: string | null
  is_superadmin: boolean
  is_admin: boolean
  is_user: boolean
  is_owner: boolean
  roles: string[]
  permissions: string[]
  created_at: string | null
  updated_at: string | null
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  username: string
  email: string
  password: string
  password_confirmation: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export interface ApiValidationError {
  message: string
  errors: Record<string, string[]>
}
