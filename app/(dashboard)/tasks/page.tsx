'use client';

import { useState, useMemo } from 'react';
import { useTasks, Task } from '@/lib/hooks/use-tasks';
import { useClients } from '@/lib/hooks/use-clients';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  CheckSquare,
  Plus,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  Calendar,
  User,
  Filter,
} from 'lucide-react';

type TaskFilter = 'all' | 'pending' | 'today' | 'overdue' | 'completed';

export default function TasksPage() {
  const { tasks, loading: tasksLoading, createTask, setTaskCompleted, deleteTask } = useTasks();
  const { clients, loading: clientsLoading } = useClients();

  const [filter, setFilter] = useState<TaskFilter>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskClientId, setNewTaskClientId] = useState<string>('none');
  const [newTaskDueAt, setNewTaskDueAt] = useState('');
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    return tasks.filter((task) => {
      switch (filter) {
        case 'pending':
          return !task.completed;
        case 'today':
          if (!task.due_at || task.completed) return false;
          const due = new Date(task.due_at);
          return due >= todayStart && due < todayEnd;
        case 'overdue':
          if (!task.due_at || task.completed) return false;
          return new Date(task.due_at) < now;
        case 'completed':
          return task.completed;
        default:
          return true;
      }
    });
  }, [tasks, filter]);

  // Task stats
  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    return {
      total: tasks.length,
      pending: tasks.filter((t) => !t.completed).length,
      today: tasks.filter((t) => {
        if (!t.due_at || t.completed) return false;
        const due = new Date(t.due_at);
        return due >= todayStart && due < todayEnd;
      }).length,
      overdue: tasks.filter((t) => {
        if (!t.due_at || t.completed) return false;
        return new Date(t.due_at) < now;
      }).length,
      completed: tasks.filter((t) => t.completed).length,
    };
  }, [tasks]);

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    await createTask({
      title: newTaskTitle.trim(),
      client_id: newTaskClientId === 'none' ? null : newTaskClientId,
      due_at: newTaskDueAt || undefined,
    });
    setNewTaskTitle('');
    setNewTaskClientId('none');
    setNewTaskDueAt('');
  };

  const getTaskStatusIcon = (task: Task) => {
    if (task.completed) {
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    }
    if (task.due_at) {
      const now = new Date();
      const due = new Date(task.due_at);
      if (due < now) {
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      }
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      if (due < todayEnd) {
        return <Clock className="h-5 w-5 text-amber-500" />;
      }
    }
    return <Circle className="h-5 w-5 text-gray-400" />;
  };

  const loading = tasksLoading || clientsLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">
            {stats.pending} pending task{stats.pending !== 1 ? 's' : ''}
            {stats.overdue > 0 && (
              <span className="text-red-600 ml-2">({stats.overdue} overdue)</span>
            )}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`p-4 rounded-lg border transition-colors ${
            filter === 'all'
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm">All Tasks</div>
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`p-4 rounded-lg border transition-colors ${
            filter === 'pending'
              ? 'bg-blue-50 border-blue-200 text-blue-700'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="text-2xl font-bold">{stats.pending}</div>
          <div className="text-sm">Pending</div>
        </button>
        <button
          onClick={() => setFilter('today')}
          className={`p-4 rounded-lg border transition-colors ${
            filter === 'today'
              ? 'bg-amber-50 border-amber-200 text-amber-700'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="text-2xl font-bold">{stats.today}</div>
          <div className="text-sm">Due Today</div>
        </button>
        <button
          onClick={() => setFilter('overdue')}
          className={`p-4 rounded-lg border transition-colors ${
            filter === 'overdue'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="text-2xl font-bold">{stats.overdue}</div>
          <div className="text-sm">Overdue</div>
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`p-4 rounded-lg border transition-colors ${
            filter === 'completed'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="text-2xl font-bold">{stats.completed}</div>
          <div className="text-sm">Completed</div>
        </button>
      </div>

      {/* Add Task Form */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="h-5 w-5 text-blue-600" />
          Add New Task
        </h2>
        <div className="flex flex-col md:flex-row gap-3">
          <Input
            placeholder="Task title..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
            className="flex-1"
          />
          <Select value={newTaskClientId} onValueChange={setNewTaskClientId}>
            <SelectTrigger className="w-full md:w-56">
              <SelectValue placeholder="Link to client (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No client</SelectItem>
              {clients.slice(0, 100).map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="datetime-local"
            value={newTaskDueAt}
            onChange={(e) => setNewTaskDueAt(e.target.value)}
            className="w-full md:w-56"
          />
          <Button onClick={handleCreateTask} disabled={!newTaskTitle.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            {filter === 'all' && 'All Tasks'}
            {filter === 'pending' && 'Pending Tasks'}
            {filter === 'today' && "Today's Tasks"}
            {filter === 'overdue' && 'Overdue Tasks'}
            {filter === 'completed' && 'Completed Tasks'}
          </h2>
          <Badge className="bg-gray-100 text-gray-700">{filteredTasks.length}</Badge>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredTasks.length === 0 ? (
            <div className="px-5 py-12 text-center text-gray-500">
              <CheckSquare className="h-10 w-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No tasks found</p>
              <p className="text-sm mt-1">
                {filter === 'all'
                  ? 'Create your first task above'
                  : 'No tasks match this filter'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="px-5 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors"
              >
                <button
                  onClick={() => setTaskCompleted(task.id, !task.completed)}
                  className="mt-0.5 flex-shrink-0"
                >
                  {getTaskStatusIcon(task)}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    {task.client && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {task.client.name}
                      </span>
                    )}
                    {task.due_at && (
                      <span
                        className={`text-xs flex items-center gap-1 ${
                          !task.completed && new Date(task.due_at) < new Date()
                            ? 'text-red-600'
                            : 'text-gray-500'
                        }`}
                      >
                        <Calendar className="h-3 w-3" />
                        {new Date(task.due_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingTask(task)}
                  className="text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {deletingTask && (
        <AlertDialog open={!!deletingTask} onOpenChange={(open) => !open && setDeletingTask(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "<strong>{deletingTask.title}</strong>"? This action
                cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await deleteTask(deletingTask.id);
                  setDeletingTask(null);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

