import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Notification } from '@fabl/types'
import { NotificationType, EntityType } from '@fabl/types'

// Mock API client for now
// const apiClient = new APIClient({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002',
//   getAuthToken: () => null
// })

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // TODO: Replace with real API call
      const mockNotifications: Notification[] = [
        {
          id: 'notif_1',
          userId: 'user_1',
          type: NotificationType.LIKE,
          actorId: 'user_2',
          entityId: 'video_1',
          entityType: EntityType.VIDEO,
          message: 'Jane Smith liked your video',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        },
        {
          id: 'notif_2',
          userId: 'user_1',
          type: NotificationType.COMMENT,
          actorId: 'user_3',
          entityId: 'video_2',
          entityType: EntityType.VIDEO,
          message: 'John Doe commented on your video',
          read: false,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        },
        {
          id: 'notif_3',
          userId: 'user_1',
          type: NotificationType.SUBSCRIBE,
          actorId: 'user_4',
          entityId: 'user_1',
          entityType: EntityType.CHANNEL,
          message: 'Emily Johnson subscribed to your channel',
          read: true,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        },
      ]
      
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockNotifications
    },
    refetchInterval: 60 * 1000, // Refetch every minute
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 200))
      return notificationId
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
      // TODO: Replace with real API call
      await new Promise(resolve => setTimeout(resolve, 200))
      return notificationId
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