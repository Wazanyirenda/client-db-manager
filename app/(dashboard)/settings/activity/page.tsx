"use client";

import { useActivityLog, ActivityAction } from "@/lib/hooks/use-activity-log";
import { Badge } from "@/components/ui/badge";
import { 
  ClockCounterClockwise, 
  User, 
  CheckSquare, 
  SignIn, 
  SignOut, 
  Pencil, 
  Trash, 
  Plus,
  DownloadSimple,
  UserCircle,
} from "@phosphor-icons/react";
import { formatDistanceToNow, format } from "date-fns";

const getActionIcon = (action: ActivityAction) => {
  switch (action) {
    case 'client_created':
      return <Plus className="h-4 w-4" weight="bold" />;
    case 'client_updated':
      return <Pencil className="h-4 w-4" weight="fill" />;
    case 'client_deleted':
      return <Trash className="h-4 w-4" weight="fill" />;
    case 'task_created':
      return <Plus className="h-4 w-4" weight="bold" />;
    case 'task_completed':
      return <CheckSquare className="h-4 w-4" weight="fill" />;
    case 'task_deleted':
      return <Trash className="h-4 w-4" weight="fill" />;
    case 'login':
      return <SignIn className="h-4 w-4" weight="fill" />;
    case 'logout':
      return <SignOut className="h-4 w-4" weight="fill" />;
    case 'profile_updated':
      return <UserCircle className="h-4 w-4" weight="fill" />;
    case 'data_exported':
      return <DownloadSimple className="h-4 w-4" weight="fill" />;
    default:
      return <ClockCounterClockwise className="h-4 w-4" weight="fill" />;
  }
};

const getActionColor = (action: ActivityAction) => {
  switch (action) {
    case 'client_created':
    case 'task_created':
      return 'text-emerald-600 bg-emerald-100';
    case 'client_updated':
    case 'profile_updated':
      return 'text-blue-600 bg-blue-100';
    case 'client_deleted':
    case 'task_deleted':
      return 'text-red-600 bg-red-100';
    case 'task_completed':
      return 'text-emerald-600 bg-emerald-100';
    case 'login':
      return 'text-blue-600 bg-blue-100';
    case 'logout':
      return 'text-gray-600 bg-gray-100';
    case 'data_exported':
      return 'text-amber-600 bg-amber-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const getActionLabel = (action: ActivityAction) => {
  switch (action) {
    case 'client_created':
      return 'Created client';
    case 'client_updated':
      return 'Updated client';
    case 'client_deleted':
      return 'Deleted client';
    case 'task_created':
      return 'Created task';
    case 'task_completed':
      return 'Completed task';
    case 'task_deleted':
      return 'Deleted task';
    case 'login':
      return 'Logged in';
    case 'logout':
      return 'Logged out';
    case 'profile_updated':
      return 'Updated profile';
    case 'data_exported':
      return 'Exported data';
    default:
      return action;
  }
};

export default function ActivitySettingsPage() {
  const { activities, loading } = useActivityLog();

  return (
    <div className="space-y-6">
      {/* Activity Log */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <ClockCounterClockwise className="h-4 w-4 text-blue-600" weight="fill" />
            Activity Log
          </h3>
          <p className="text-sm text-gray-500 mt-1">Your recent actions and activities.</p>
        </div>

        <div className="divide-y divide-gray-100">
          {loading ? (
            <div className="px-6 py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-3">Loading activity...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <ClockCounterClockwise className="h-10 w-10 text-gray-300 mx-auto mb-3" weight="fill" />
              <p className="text-sm font-medium text-gray-900">No activity yet</p>
              <p className="text-xs text-gray-500 mt-1">Your actions will appear here</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${getActionColor(activity.action)}`}>
                    {getActionIcon(activity.action)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900">
                        {getActionLabel(activity.action)}
                      </span>
                      {activity.entity_name && (
                        <Badge className="bg-gray-100 text-gray-700 font-normal">
                          {activity.entity_name}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Metadata */}
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">
                        {activity.metadata.format && (
                          <span>Format: {activity.metadata.format.toUpperCase()}</span>
                        )}
                        {activity.metadata.count && (
                          <span> ({activity.metadata.count} records)</span>
                        )}
                      </div>
                    )}

                    {/* Time */}
                    <div className="mt-1 text-xs text-gray-400 flex items-center gap-2">
                      <span>{formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}</span>
                      <span>•</span>
                      <span>{format(new Date(activity.created_at), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-3">
          <ClockCounterClockwise className="h-4 w-4" weight="fill" />
          About Activity Logging
        </h3>
        <p className="text-sm text-blue-800">
          We track your actions to help you maintain an audit trail of changes made to your data.
          Activity logs are stored securely and are only visible to you. This includes client 
          management actions, task updates, data exports, and account activities.
        </p>
      </div>
    </div>
  );
}

