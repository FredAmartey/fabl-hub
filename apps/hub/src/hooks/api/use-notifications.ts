import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import type { Notification } from '@fabl/types'
import { apiClient } from '@/lib/api-client'

export function useNotifications() {
  const { getToken } = useAuth()
  
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      try {
        const token = await getToken()
        
        // Use direct fetch since the API returns array directly, not ApiResponse wrapper
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/notifications`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        })
        
        if (!response.ok) {
          console.error('Failed to fetch notifications:', response.status)
          return []
        }
        
        const data = await response.json()
        return Array.isArray(data) ? data : []
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
        // Return empty array on error to avoid undefined
        return []
      }
    },
    refetchInterval: 60 * 1000, // Refetch every minute
    retry: 1, // Only retry once
    retryDelay: 1000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        await apiClient.put(`/notifications/${notificationId}/read`)
        return notificationId
      } catch (error) {
        console.error('Failed to mark notification as read:', error)
        throw error
      }
    },
    onMutate: async (notificationId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      
      const previousNotifications = queryClient.getQueryData<Notification[]>(['notifications'])
      
      queryClient.setQueryData<Notification[]>(['notifications'], (old) => {
        if (!old) return []
        return old.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      })
      
      return { previousNotifications }
    },
    onError: (_err, _notificationId, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      try {
        await apiClient.delete(`/notifications/${notificationId}`)
        return notificationId
      } catch (error) {
        console.error('Failed to delete notification:', error)
        throw error
      }
    },
    onMutate: async (notificationId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      
      const previousNotifications = queryClient.getQueryData<Notification[]>(['notifications'])
      
      queryClient.setQueryData<Notification[]>(['notifications'], (old) => {
        if (!old) return []
        return old.filter(notif => notif.id !== notificationId)
      })
      
      return { previousNotifications }
    },
    onError: (_err, _notificationId, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      try {
        await apiClient.put('/notifications/read-all')
      } catch (error) {
        console.error('Failed to mark all notifications as read:', error)
        throw error
      }
    },
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['notifications'] })
      
      const previousNotifications = queryClient.getQueryData<Notification[]>(['notifications'])
      
      queryClient.setQueryData<Notification[]>(['notifications'], (old) => {
        if (!old) return []
        return old.map(notif => ({ ...notif, read: true }))
      })
      
      return { previousNotifications }
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(['notifications'], context.previousNotifications)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      try {
        const response = await apiClient.get<{ count: number }>('/notifications/unread-count')
        return response.data.count
      } catch (error) {
        console.error('Failed to fetch unread notification count:', error)
        throw error
      }
    },
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  })
}