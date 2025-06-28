"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getSessionToken } from '@/lib/auth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AnalyticsOverview from '@/components/dashboard/AnalyticsOverview';
import { 
  Users, 
  FileText, 
  Eye, 
  TrendingUp,
  Calendar,
  Globe,
  Clock,
  Settings,
  LogOut
} from 'lucide-react';

interface AnalyticsSummary {
  totalVisitors: number;
  totalFormSubmissions: number;
  totalPageViews: number;
  recentSubmissions: any[];
  visitorsByDay: { date: string; count: number }[];
  submissionsByDay: { date: string; count: number }[];
  topPages: { page: string; count: number }[];
  topSources: { source: string; count: number }[];
}

export default function DashboardPage() {
  const { isLoggedIn, client, loading, logout } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, loading, router]);

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!isLoggedIn || !client) return;

      try {
        const token = getSessionToken();
        if (!token) {
          logout();
          return;
        }

        const response = await fetch('/api/dashboard/analytics', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const result = await response.json();
          setAnalytics(result.analytics);
        } else if (response.status === 401) {
          logout();
        } else {
          setError('Failed to load analytics data');
        }
      } catch (error) {
        console.error('Analytics fetch error:', error);
        setError('Network error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn && client) {
      loadAnalytics();
      // Refresh data every 30 seconds
      const interval = setInterval(loadAnalytics, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, client, logout]);

  if (loading || !client) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex items-center gap-3 text-orange-400">
          <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-orange-400">Redirecting to login...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-orange-400">
            <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
            Loading analytics...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-400 mb-4">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Visitors',
      value: analytics?.totalVisitors || 0,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Unique visitors to your site'
    },
    {
      title: 'Form Submissions',
      value: analytics?.totalFormSubmissions || 0,
      icon: FileText,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Contact form submissions'
    },
    {
      title: 'Page Views',
      value: analytics?.totalPageViews || 0,
      icon: Eye,
      gradient: 'from-emerald-500 to-teal-500',
      description: 'Total page views'
    },
    {
      title: 'Avg. Daily Visitors',
      value: analytics?.visitorsByDay ? Math.round(analytics.visitorsByDay.reduce((sum, day) => sum + day.count, 0) / 7) : 0,
      icon: TrendingUp,
      gradient: 'from-amber-500 to-orange-500',
      description: 'Average over last 7 days'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back, {client.name}
            </h1>
            <p className="text-slate-300 mt-2">
              Monitor your website's performance and visitor engagement
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/95 border border-slate-800 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:border-orange-500/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-white">
                    {stat.value}
                  </span>
                </div>
                <h3 className="font-semibold text-white">
                  {stat.title}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {stat.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Analytics Overview */}
        {analytics && <AnalyticsOverview analytics={analytics} />}
      </div>
    </DashboardLayout>
  );
} 