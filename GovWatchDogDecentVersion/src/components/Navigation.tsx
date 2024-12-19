import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, TrendingUp, Home } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Request Report', href: '/request-report', icon: FileText },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Budget Watchdog</span>
            </Link>
          </div>
          
          <div className="flex space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}