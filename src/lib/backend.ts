import type { Backend } from './types'
import { createSupabaseBackend } from './supabaseBackend'
import { createLocalBackend } from './localBackend'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** null means the site was built without its database settings; the app shows a setup notice. */
export const backend: Backend | null =
  url && key ? createSupabaseBackend(url, key) : import.meta.env.DEV ? createLocalBackend() : null
