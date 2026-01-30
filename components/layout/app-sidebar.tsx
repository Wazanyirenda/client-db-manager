'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  House,
  Users,
  CheckSquare,
  Kanban,
  ChartBar,
  CaretLeft,
  CaretRight,
  X,
} from '@phosphor-icons/react';

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: House },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/insights', label: 'Insights', icon: ChartBar },
];

// Settings and Logout are in the profile dropdown only - no duplicates

export function AppSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AppSidebarProps) {
  const pathname = usePathname();

  const handleNavClick = () => {
    // Close mobile sidebar when navigating
    if (mobileOpen && onMobileClose) {
      onMobileClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col z-50 transition-all duration-300',
          // Mobile: hidden by default, slide in when mobileOpen
          'max-lg:-translate-x-full max-lg:w-64',
          mobileOpen && 'max-lg:translate-x-0',
          // Desktop: respect collapsed state
          'lg:translate-x-0',
          collapsed ? 'lg:w-16' : 'lg:w-56'
        )}
      >
        {/* Logo / Brand */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {/* Mobile: always show brand, Desktop: hide when collapsed */}
          <span className={cn(
            'font-bold text-lg text-blue-600',
            'lg:block',
            collapsed && 'lg:hidden'
          )}>
            ClientHub
          </span>
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileClose}
            className="h-8 w-8 p-0 lg:hidden"
          >
            <X className="h-4 w-4" weight="bold" />
          </Button>

          {/* Desktop collapse button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn('h-8 w-8 p-0 hidden lg:flex', collapsed && 'mx-auto')}
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
              onClick={handleNavClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100 border border-transparent',
                // Mobile: never justify-center, Desktop: respect collapsed
                'lg:data-[collapsed=true]:justify-center lg:data-[collapsed=true]:px-2'
              )}
              data-collapsed={collapsed}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" weight={isActive ? 'fill' : 'regular'} />
              {/* Mobile: always show label, Desktop: hide when collapsed */}
              <span className={cn('lg:block', collapsed && 'lg:hidden')}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </aside>
    </>
  );
}
