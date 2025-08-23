import React from 'react';

export default function AirCargo() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Air Cargo Management</h1>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Air Cargo Management</h3>
          <p className="text-white/70 mb-4">Manage air transportation and cargo flights</p>
          <p className="text-sm text-white/50">This page will be implemented to connect with the air-cargo API endpoints</p>
        </div>
      </div>
    </div>
  );
}
