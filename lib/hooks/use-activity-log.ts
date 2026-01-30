"use client";

import { useState, useEffect, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

export type ActivityAction = 
  | 'client_created'
  | 'client_updated'
  | 'client_deleted'
  | 'task_created'
  | 'task_completed'
  | 'task_deleted'
  | 'login'
  | 'logout'
  | 'profile_updated'
  | 'data_exported';

export type EntityType = 'client' | 'task' | 'profile' | 'data';

export interface ActivityLog {
  id: string;
  user_id: string;
  action: ActivityAction;
  entity_type: EntityType | null;
  entity_id: string | null;
  entity_name: string | null;
  metadata: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export function useActivityLog() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseBrowserClient();

  const fetchActivities = useCallback(async (limit = 50) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activity logs:', error);
    } else {
      setActivities(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  const logActivity = async (
    action: ActivityAction,
    options?: {
      entity_type?: EntityType;
      entity_id?: string;
      entity_name?: string;
      metadata?: Record<string, any>;
    }
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const userAgent = typeof window !== 'undefined' ? navigator.userAgent : null;

    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action,
        entity_type: options?.entity_type || null,
        entity_id: options?.entity_id || null,
        entity_name: options?.entity_name || null,
        metadata: options?.metadata || {},
        user_agent: userAgent,
      });

    if (error) {
      console.error('Error logging activity:', error);
    } else {
      // Refresh activities if we're showing them
      fetchActivities();
    }
  };

  // Helper functions for common actions
  const logClientCreated = (clientId: string, clientName: string) => {
    return logActivity('client_created', {
      entity_type: 'client',
      entity_id: clientId,
      entity_name: clientName,
    });
  };

  const logClientUpdated = (clientId: string, clientName: string, changes?: Record<string, any>) => {
    return logActivity('client_updated', {
      entity_type: 'client',
      entity_id: clientId,
      entity_name: clientName,
      metadata: changes ? { changes } : {},
    });
  };

  const logClientDeleted = (clientName: string) => {
    return logActivity('client_deleted', {
      entity_type: 'client',
      entity_name: clientName,
    });
  };

  const logTaskCreated = (taskId: string, taskTitle: string) => {
    return logActivity('task_created', {
      entity_type: 'task',
      entity_id: taskId,
      entity_name: taskTitle,
    });
  };

  const logTaskCompleted = (taskId: string, taskTitle: string) => {
    return logActivity('task_completed', {
      entity_type: 'task',
      entity_id: taskId,
      entity_name: taskTitle,
    });
  };

  const logTaskDeleted = (taskTitle: string) => {
    return logActivity('task_deleted', {
      entity_type: 'task',
      entity_name: taskTitle,
    });
  };

  const logLogin = () => {
    return logActivity('login');
  };

  const logLogout = () => {
    return logActivity('logout');
  };

  const logProfileUpdated = () => {
    return logActivity('profile_updated', {
      entity_type: 'profile',
    });
  };

  const logDataExported = (format: string, count: number) => {
    return logActivity('data_exported', {
      entity_type: 'data',
      metadata: { format, count },
    });
  };

  return {
    activities,
    loading,
    logActivity,
    logClientCreated,
    logClientUpdated,
    logClientDeleted,
    logTaskCreated,
    logTaskCompleted,
    logTaskDeleted,
    logLogin,
    logLogout,
    logProfileUpdated,
    logDataExported,
    refetch: fetchActivities,
  };
}

// Create a singleton instance for use outside of components
let activityLogInstance: ReturnType<typeof useActivityLog> | null = null;

export function getActivityLogger() {
  if (!activityLogInstance) {
    // This is a simple helper - for real use, you'd want to call these functions within components
    const supabase = createSupabaseBrowserClient();
    
    return {
      async logActivity(
        action: ActivityAction,
        options?: {
          entity_type?: EntityType;
          entity_id?: string;
          entity_name?: string;
          metadata?: Record<string, any>;
        }
      ) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const userAgent = typeof window !== 'undefined' ? navigator.userAgent : null;

        await supabase
          .from('activity_logs')
          .insert({
            user_id: user.id,
            action,
            entity_type: options?.entity_type || null,
            entity_id: options?.entity_id || null,
            entity_name: options?.entity_name || null,
            metadata: options?.metadata || {},
            user_agent: userAgent,
          });
      }
    };
  }
  return activityLogInstance;
}



