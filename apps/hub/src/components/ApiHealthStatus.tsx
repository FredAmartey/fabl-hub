'use client'

import { useApiHealth } from '@/hooks/use-api'

export function ApiHealthStatus() {
  const { data, isLoading, error } = useApiHealth()

  if (isLoading) {
    return <div className="text-yellow-400 text-sm">Checking API...</div>
  }

  if (error) {
    return <div className="text-red-400 text-sm">API Error: {error.message}</div>
  }

  if (data?.status === 'ok') {
    return <div className="text-green-400 text-sm">API Connected ✓</div>
  }

  return null
}