import { APIClient } from '@fabl/utils'

// Studio API client with Clerk auth
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'
console.log('Studio API Client baseURL:', baseURL)

// Store the current auth token
let currentAuthToken: string | null = null

export const setAuthToken = (token: string | null) => {
  currentAuthToken = token
}

export const apiClient = new APIClient({
  baseURL: baseURL,
  getAuthToken: () => currentAuthToken
})