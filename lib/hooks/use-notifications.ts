"use client";

import { useState, useEffect, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export type NotificationType = 
  | 'task_due' 
  | 'task_overdue' 
  | 'follow_up_due' 
  | 'invoice_overdue' 
  | 'no_contact';

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  read: boolean;
  client_id: string | null;
  task_id: string | null;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    name: string;
  } | null;
  task?: {
    id: string;
    title: string;
  } | null;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const supabase = createSupabaseBrowserClient();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        client:clients(id, name),
        task:tasks(id, title)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching notifications:', error);
    } else {
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.read).length);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchNotifications();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchNotifications, supabase]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      toast.error('Failed to mark notification as read');
    } else {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (error) {
      toast.error('Failed to mark all as read');
    } else {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    }
  };

  const deleteNotification = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete notification');
    } else {
      const deleted = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      if (deleted && !deleted.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  const createNotification = async (notification: {
    type: NotificationType;
    title: string;
    message?: string;
    client_id?: string;
    task_id?: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: user.id,
        ...notification,
      });

    if (error) {
      console.error('Error creating notification:', error);
    }
  };

  // Generate notifications based on data
  const generateNotifications = async (
    clients: Array<{ id: string; name: string; next_follow_up?: string | null; last_contact?: string | null; invoice_status?: string | null; invoice_due_date?: string | null }>,
    tasks: Array<{ id: string; title: string; due_at?: string | null; completed: boolean }>
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const now = new Date();
    const notificationsToCreate: Array<{
      type: NotificationType;
      title: string;
      message: string;
      client_id?: string;
      task_id?: string;
    }> = [];

    // Check tasks due today
    tasks.forEach(task => {
      if (task.completed || !task.due_at) return;
      const due = new Date(task.due_at);
      const isToday = due.toDateString() === now.toDateString();
      const isOverdue = due < now && !isToday;

      if (isToday) {
        notificationsToCreate.push({
          type: 'task_due',
          title: 'Task due today',
          message: task.title,
          task_id: task.id,
        });
      } else if (isOverdue) {
        notificationsToCreate.push({
          type: 'task_overdue',
          title: 'Task overdue',
          message: task.title,
          task_id: task.id,
        });
      }
    });

    // Check follow-ups due
    clients.forEach(client => {
      if (client.next_follow_up) {
        const followUp = new Date(client.next_follow_up);
        if (followUp <= now) {
          notificationsToCreate.push({
            type: 'follow_up_due',
            title: 'Follow-up due',
            message: `${client.name} needs follow-up`,
            client_id: client.id,
          });
        }
      }

      // Check overdue invoices
      if (client.invoice_status !== 'Paid' && client.invoice_due_date) {
        const dueDate = new Date(client.invoice_due_date);
        if (dueDate < now) {
          notificationsToCreate.push({
            type: 'invoice_overdue',
            title: 'Invoice overdue',
            message: `Invoice for ${client.name} is past due`,
            client_id: client.id,
          });
        }
      }

      // Check no contact in 30+ days
      if (client.last_contact) {
        const lastContact = new Date(client.last_contact);
        const daysSince = Math.floor((now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSince >= 30) {
          notificationsToCreate.push({
            type: 'no_contact',
            title: 'No recent contact',
            message: `${client.name} hasn't been contacted in ${daysSince} days`,
            client_id: client.id,
          });
        }
      }
    });

    // Only create if we have notifications
    if (notificationsToCreate.length > 0) {
      // Insert without duplicating existing notifications
      for (const n of notificationsToCreate.slice(0, 10)) {
        await createNotification(n);
      }
    }
  };

  return {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    generateNotifications,
    refetch: fetchNotifications,
  };
}

