'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  House,
  Users,
  CheckSquare,
  Kanban,
  ChartBar,
} from '@phosphor-icons/react';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: House },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/insights', label: 'Insights', icon: ChartBar },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-lg transition-colors',
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Icon
                className="h-5 w-5"
                weight={isActive ? 'fill' : 'regular'}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

