import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export function useUrlState<T extends Record<string, string>>(
  defaultValues: T
): [T, (updates: Partial<T>) => void] {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Get current state from URL or defaults
  const state = useMemo(() => {
    const result = { ...defaultValues }
    
    for (const key in defaultValues) {
      const urlValue = searchParams.get(key)
      if (urlValue !== null) {
        result[key] = urlValue as T[Extract<keyof T, string>]
      }
    }
    
    return result
  }, [searchParams, defaultValues])

  // Update URL with new state
  const setState = useCallback((updates: Partial<T>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === defaultValues[key] || value === null || value === undefined) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    
    const search = params.toString()
    const url = search ? `${pathname}?${search}` : pathname
    
    router.push(url, { scroll: false })
  }, [searchParams, pathname, router, defaultValues])

  return [state, setState]
}