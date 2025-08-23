import React from 'react';

export default function Inventory() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
      </div>

      <div className="bg-white/5 rounded-lg p-6 border border-white/10 backdrop-blur">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Inventory Management</h3>
          <p className="text-white/70 mb-4">Manage warehouse inventory and stock levels</p>
          <p className="text-sm text-white/50">This page will be implemented to connect with the inventory API endpoints</p>
        </div>
      </div>
    </div>
  );
}
