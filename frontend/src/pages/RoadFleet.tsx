import React from 'react';

export default function RoadFleet() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Road Fleet Management</h1>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Road Fleet Management</h3>
          <p className="text-white/70 mb-4">Manage road transportation vehicles and drivers</p>
          <p className="text-sm text-white/50">This page will be implemented to connect with the road-fleet API endpoints</p>
        </div>
      </div>
    </div>
  );
}
