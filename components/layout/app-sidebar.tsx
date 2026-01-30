'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  House,
  Users,
  CheckSquare,
  Kanban,
  ChartBar,
  Gear,
  SignOut,
  CaretLeft,
  CaretRight,
} from '@phosphor-icons/react';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: House },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/insights', label: 'Insights', icon: ChartBar },
];

const bottomNavItems = [
  { href: '/settings/profile', label: 'Settings', icon: Gear },
];

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col z-40 transition-all duration-300',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo / Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!collapsed && (
          <span className="font-bold text-lg text-blue-600">ClientHub</span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn('h-8 w-8 p-0', collapsed && 'mx-auto')}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? (
            <CaretRight className="h-4 w-4" weight="bold" />
          ) : (
            <CaretLeft className="h-4 w-4" weight="bold" />
          )}
        </Button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100 border border-transparent',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" weight={isActive ? 'fill' : 'regular'} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="py-4 px-2 border-t border-gray-200 space-y-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100 border border-transparent',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" weight={isActive ? 'fill' : 'regular'} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-gray-700 hover:bg-red-50 hover:text-red-600 border border-transparent',
            collapsed && 'justify-center px-2'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <SignOut className="h-5 w-5 flex-shrink-0" weight="regular" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
