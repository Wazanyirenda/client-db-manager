'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications, Notification, NotificationType } from '@/lib/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  CheckSquare,
  Clock,
  Receipt,
  UserCircle,
  Check,
  Trash,
  CaretRight,
} from '@phosphor-icons/react';
import { formatDistanceToNow } from 'date-fns';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'task_due':
    case 'task_overdue':
      return <CheckSquare className="h-4 w-4" weight="fill" />;
    case 'follow_up_due':
      return <Clock className="h-4 w-4" weight="fill" />;
    case 'invoice_overdue':
      return <Receipt className="h-4 w-4" weight="fill" />;
    case 'no_contact':
      return <UserCircle className="h-4 w-4" weight="fill" />;
    default:
      return <Bell className="h-4 w-4" weight="fill" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'task_due':
      return 'text-amber-600 bg-amber-100';
    case 'task_overdue':
      return 'text-red-600 bg-red-100';
    case 'follow_up_due':
      return 'text-blue-600 bg-blue-100';
    case 'invoice_overdue':
      return 'text-red-600 bg-red-100';
    case 'no_contact':
      return 'text-purple-600 bg-purple-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export function NotificationDropdown() {
  const router = useRouter();
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate based on type
    if (notification.client_id) {
      router.push(`/clients?view=${notification.client_id}`);
    } else if (notification.task_id) {
      router.push('/tasks');
    }

    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative">
          <Bell className="h-5 w-5 text-gray-500" weight={unreadCount > 0 ? 'fill' : 'regular'} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-0 max-h-[480px] overflow-hidden"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[360px]">
          {loading ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm mt-2">Loading...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" weight="regular" />
              <p className="text-sm font-medium">No notifications</p>
              <p className="text-xs mt-1">You're all caught up!</p>
            </div>
          ) : (
            notifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.read ? 'bg-blue-50/50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0" onClick={() => handleNotificationClick(notification)}>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    {notification.message && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {notification.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-600"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" weight="bold" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash className="h-4 w-4" weight="regular" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="m-0" />
            <div className="p-2">
              <button
                onClick={() => {
                  router.push('/settings/activity');
                  setOpen(false);
                }}
                className="w-full px-3 py-2 text-sm text-center text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center justify-center gap-1"
              >
                View all activity
                <CaretRight className="h-4 w-4" weight="bold" />
              </button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

