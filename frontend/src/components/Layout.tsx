import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldAlert,
  Building2,
  TrendingUp,
  Play,
  Bell,
  DollarSign,
  Plug,
  Users,
  Settings,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { name: 'Risk Assessment', href: '/app/risk-assessment', icon: ShieldAlert },
  { name: 'Suppliers', href: '/app/suppliers', icon: Building2 },
  { name: 'Analytics', href: '/app/analytics', icon: TrendingUp },
  { name: 'Scenarios', href: '/app/scenarios', icon: Play },
  { name: 'Alerts', href: '/app/alerts', icon: Bell },
  { name: 'Cost Analysis', href: '/app/cost-analysis', icon: DollarSign },
  { name: 'Integrations', href: '/app/integrations', icon: Plug },
  { name: 'Users', href: '/app/users', icon: Users },
  { name: 'Settings', href: '/app/settings', icon: Settings },
];

export default function Layout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-black/95 backdrop-blur-md shadow-xl border-r border-white/10">
            <div className="flex h-16 items-center justify-between px-4">
              <h1 className="text-xl font-bold text-blue-400">Supply Chain AI</h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="mt-8 space-y-2 px-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    <Icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-black/95 backdrop-blur-md border-r border-white/10">
          <div className="flex h-16 items-center px-4">
            <h1 className="text-xl font-bold text-blue-400">Supply Chain AI</h1>
          </div>
          <nav className="mt-8 flex-1 space-y-2 px-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 bg-black/50 backdrop-blur-sm shadow-sm lg:bg-transparent lg:shadow-none border-b border-white/10">
          <button
            type="button"
            className="px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="flex flex-1 justify-between px-4 lg:px-6">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-white lg:text-gray-900 lg:dark:text-white">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-white/70 hover:text-blue-400 cursor-pointer" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  3
                </span>
              </div>

              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium">JD</span>
              </div>
            </div>
          </div>
        </div>

                 {/* Page content */}
         <main className="py-6">
           <div className="px-4 sm:px-6 lg:px-8">
             <Outlet />
           </div>
         </main>
      </div>
    </div>
  );
}