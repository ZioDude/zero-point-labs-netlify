"use client";

import { motion } from 'framer-motion';
import { Calendar, Clock, Eye, Globe } from 'lucide-react';

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

interface AnalyticsOverviewProps {
  analytics: AnalyticsSummary;
}

export default function AnalyticsOverview({ analytics }: AnalyticsOverviewProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Visitor Trend Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-black/95 border border-slate-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-400" />
          Visitor Trend (Last 7 Days)
        </h3>
        <div className="space-y-3">
          {analytics.visitorsByDay.map((day, index) => (
            <div key={day.date} className="flex items-center space-x-3">
              <span className="text-sm text-slate-300 w-24">
                {new Date(day.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
              <div className="flex-1 bg-slate-800 rounded-full h-6 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.max(5, (day.count / Math.max(...analytics.visitorsByDay.map(d => d.count), 1)) * 100)}%` 
                  }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-slate-300">
                  {day.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Submission Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-black/95 border border-slate-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Eye className="h-5 w-5 mr-2 text-purple-400" />
          Form Submissions (Last 7 Days)
        </h3>
        <div className="space-y-3">
          {analytics.submissionsByDay.map((day, index) => (
            <div key={day.date} className="flex items-center space-x-3">
              <span className="text-sm text-slate-300 w-24">
                {new Date(day.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
              <div className="flex-1 bg-slate-800 rounded-full h-6 relative overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.max(5, (day.count / Math.max(...analytics.submissionsByDay.map(d => d.count), 1)) * 100)}%` 
                  }}
                  transition={{ delay: index * 0.1 + 0.6, duration: 0.8 }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                />
                <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium text-slate-300">
                  {day.count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Form Submissions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="lg:col-span-2 bg-black/95 border border-slate-800 rounded-2xl shadow-lg p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-emerald-400" />
          Recent Form Submissions
        </h3>
        {analytics.recentSubmissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-slate-300">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">Service</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentSubmissions.slice(0, 5).map((submission: any, index) => (
                  <motion.tr
                    key={submission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.7 }}
                    className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-slate-300">
                      {new Date(submission.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-white">
                      {submission.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-300">
                      {submission.email}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-300">
                      {submission.service}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        submission.status === 'new' ? 'bg-blue-500/20 text-blue-400' :
                        submission.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                        submission.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        'bg-slate-500/20 text-slate-400'
                      }`}>
                        {submission.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-slate-400 mb-2">No form submissions yet</div>
            <p className="text-sm text-slate-500">
              Form submissions will appear here once visitors start contacting you
            </p>
          </div>
        )}
      </motion.div>

      {/* Top Pages & Traffic Sources */}
      {(analytics.topPages.length > 0 || analytics.topSources.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Top Pages */}
          {analytics.topPages.length > 0 && (
            <div className="bg-black/95 border border-slate-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-emerald-400" />
                Top Pages
              </h3>
              <div className="space-y-3">
                {analytics.topPages.map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-slate-400 w-6">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-medium text-white">
                        {page.page}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-300">
                      {page.count} views
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Traffic Sources */}
          {analytics.topSources.length > 0 && (
            <div className="bg-black/95 border border-slate-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-amber-400" />
                Traffic Sources
              </h3>
              <div className="space-y-3">
                {analytics.topSources.map((source) => (
                  <div key={source.source} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">
                      {source.source}
                    </span>
                    <span className="text-sm font-bold text-slate-300">
                      {source.count} visitors
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
} 