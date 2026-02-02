"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from '@/lib/utils/toast';

export interface Task {
  id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  due_at: string | null;
  completed: boolean;
  created_at: string;
  updated_at: string;
  client?: { id: string; name: string } | null;
}

export interface TaskCreateData {
  title: string;
  client_id?: string | null;
  due_at?: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createSupabaseBrowserClient();

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("tasks")
        .select("*, client:clients(id,name)")
        .eq("user_id", user.id)
        .order("completed", { ascending: true })
        .order("due_at", { ascending: true, nullsFirst: false });

      if (fetchError) throw fetchError;
      setTasks((data as any) || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task: TaskCreateData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error: insertError } = await supabase
        .from("tasks")
        .insert({
          user_id: user.id,
          client_id: task.client_id ?? null,
          title: task.title,
          due_at: task.due_at ? new Date(task.due_at).toISOString() : null,
        })
        .select("*, client:clients(id,name)")
        .single();

      if (insertError) throw insertError;
      setTasks([data as any, ...tasks]);
      toast.success("Task added");
      return { success: true as const };
    } catch (err: any) {
      toast.error(err.message || "Failed to add task");
      return { success: false as const, error: err.message as string };
    }
  };

  const setTaskCompleted = async (id: string, completed: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from("tasks")
        .update({
          completed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) throw updateError;
      setTasks(tasks.map((t) => (t.id === id ? { ...t, completed } : t)));
      return { success: true as const };
    } catch (err: any) {
      toast.error(err.message || "Failed to update task");
      return { success: false as const, error: err.message as string };
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from("tasks").delete().eq("id", id);
      if (deleteError) throw deleteError;
      setTasks(tasks.filter((t) => t.id !== id));
      toast.success("Task deleted");
      return { success: true as const };
    } catch (err: any) {
      toast.error(err.message || "Failed to delete task");
      return { success: false as const, error: err.message as string };
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    setTaskCompleted,
    deleteTask,
  };
}




