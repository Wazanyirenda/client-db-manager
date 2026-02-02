'use client';

import Link from 'next/link';
import Image from 'next/image';
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
  SidebarSimple,
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

export function AppSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: AppSidebarProps) {
  const pathname = usePathname();

  const handleNavClick = () => {
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
          'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col z-50 transition-all duration-300 shadow-sm',
          'max-lg:-translate-x-full max-lg:w-64',
          mobileOpen && 'max-lg:translate-x-0',
          'lg:translate-x-0',
          collapsed ? 'lg:w-[72px]' : 'lg:w-60'
        )}
      >
        {/* Logo / Brand */}
        <div className={cn(
          'h-16 flex items-center border-b border-gray-200',
          collapsed ? 'lg:justify-center lg:px-2' : 'justify-between px-4'
        )}>
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/cliently-logo.png"
              alt="Cliently"
              width={40}
              height={40}
              className="rounded-xl flex-shrink-0"
            />
            <span className={cn(
              'font-bold text-xl text-blue-600 transition-opacity',
              collapsed ? 'lg:hidden lg:opacity-0' : 'lg:opacity-100'
            )}>
              Cliently
            </span>
          </Link>
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileClose}
            className="h-9 w-9 p-0 lg:hidden hover:bg-gray-100"
          >
            <X className="h-5 w-5" weight="bold" />
          </Button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
                  collapsed && 'lg:justify-center lg:px-0'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn('h-5 w-5 flex-shrink-0', collapsed && 'lg:h-6 lg:w-6')} weight={isActive ? 'fill' : 'regular'} />
                <span className={cn(
                  'transition-opacity',
                  collapsed ? 'lg:hidden lg:opacity-0 lg:w-0' : 'lg:opacity-100'
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle - Desktop Only */}
        <div className={cn(
          'hidden lg:block border-t border-gray-200 p-3',
          collapsed && 'px-2'
        )}>
          <button
            onClick={onToggle}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200',
              'text-gray-500 hover:bg-gray-100 hover:text-gray-700',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <CaretRight className="h-5 w-5" weight="bold" />
            ) : (
              <>
                <SidebarSimple className="h-5 w-5" weight="regular" />
                <span>Collapse</span>
                <CaretLeft className="h-4 w-4 ml-auto" weight="bold" />
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
