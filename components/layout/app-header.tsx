'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/dashboard/user-avatar';
import { NotificationDropdown } from '@/components/notifications/notification-dropdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useProfile } from '@/lib/hooks/use-clients';
import { MagnifyingGlass, User, Gear, SignOut } from '@phosphor-icons/react';

interface AppHeaderProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
}

export function AppHeader({ onSearch, searchPlaceholder = 'Search...' }: AppHeaderProps) {
  const router = useRouter();
  const { profile } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left: Greeting */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {getGreeting()}, {profile?.full_name?.split(' ')[0] || 'there'}
          </h1>
          <p className="text-xs text-gray-500">
            {profile?.company_name || 'Manage your clients'}
          </p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" weight="regular" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSearch?.(e.target.value);
            }}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <NotificationDropdown />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <UserAvatar name={profile?.full_name} size={36} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-white border border-gray-200 rounded-lg shadow-lg p-1"
          >
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-900">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500">{profile?.email}</p>
            </div>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem
              onClick={() => router.push('/settings/profile')}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded flex items-center gap-2"
            >
              <User className="h-4 w-4" weight="regular" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push('/settings')}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded flex items-center gap-2"
            >
              <Gear className="h-4 w-4" weight="regular" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-red-50 hover:text-red-600 rounded flex items-center gap-2 text-red-600"
            >
              <SignOut className="h-4 w-4" weight="regular" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
