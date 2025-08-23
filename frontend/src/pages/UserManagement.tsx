import React, { useState } from 'react';
import { Users, UserPlus, Shield, Mail, Phone, MoreVertical, Edit, Trash2 } from 'lucide-react';

const users = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Administrator',
    department: 'Supply Chain',
    status: 'active',
    lastLogin: '2024-01-22 10:30:00',
    permissions: ['all'],
    avatar: 'JS',
    phone: '+1-555-0123'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    role: 'Manager',
    department: 'Procurement',
    status: 'active',
    lastLogin: '2024-01-22 09:15:00',
    permissions: ['read', 'write', 'analytics'],
    avatar: 'SJ',
    phone: '+1-555-0124'
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'm.chen@company.com',
    role: 'Analyst',
    department: 'Risk Management',
    status: 'active',
    lastLogin: '2024-01-22 08:45:00',
    permissions: ['read', 'analytics'],
    avatar: 'MC',
    phone: '+1-555-0125'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'e.davis@company.com',
    role: 'Viewer',
    department: 'Operations',
    status: 'inactive',
    lastLogin: '2024-01-20 16:20:00',
    permissions: ['read'],
    avatar: 'ED',
    phone: '+1-555-0126'
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'd.wilson@company.com',
    role: 'Manager',
    department: 'Logistics',
    status: 'pending',
    lastLogin: 'Never',
    permissions: ['read', 'write'],
    avatar: 'DW',
    phone: '+1-555-0127'
  }
];

const roles = [
  {
    name: 'Administrator',
    description: 'Full system access and user management',
    permissions: ['all'],
    color: 'text-red-400 bg-red-400/10'
  },
  {
    name: 'Manager',
    description: 'Read/write access to assigned areas',
    permissions: ['read', 'write', 'analytics'],
    color: 'text-blue-400 bg-blue-400/10'
  },
  {
    name: 'Analyst',
    description: 'Read and analytics access',
    permissions: ['read', 'analytics'],
    color: 'text-green-400 bg-green-400/10'
  },
  {
    name: 'Viewer',
    description: 'Read-only access',
    permissions: ['read'],
    color: 'text-gray-400 bg-gray-400/10'
  }
];

const departments = ['Supply Chain', 'Procurement', 'Risk Management', 'Operations', 'Logistics', 'Finance'];

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [filter, setFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10';
      case 'inactive': return 'text-gray-400 bg-gray-400/10';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getRoleInfo = (roleName: string) => {
    return roles.find(role => role.name === roleName);
  };

  const filteredUsers = filter === 'all' ? users : users.filter(user => user.status === filter);
  const activeUsers = users.filter(user => user.status === 'active').length;
  const pendingUsers = users.filter(user => user.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Users</p>
              <p className="text-2xl font-bold text-white">{users.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Active Users</p>
              <p className="text-2xl font-bold text-green-400">{activeUsers}</p>
            </div>
            <Users className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">{pendingUsers}</p>
            </div>
            <Users className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 mb-1">Departments</p>
              <p className="text-2xl font-bold text-purple-400">{departments.length}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">User Directory</h3>
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
            >
              <option value="all">All Users</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <button
              onClick={() => setShowAddUser(!showAddUser)}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm"
            >
              <UserPlus size={16} className="mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* Add User Form */}
        {showAddUser && (
          <div className="mb-6 p-4 bg-slate-700 rounded-lg">
            <h4 className="text-white font-medium mb-4">Add New User</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                <select className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
                  {roles.map(role => (
                    <option key={role.name} value={role.name}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Department</label>
                <select className="w-full bg-slate-600 border border-slate-500 rounded-lg px-3 py-2 text-white">
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm">
                Create User
              </button>
              <button
                onClick={() => setShowAddUser(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* User List */}
        <div className="space-y-3">
          {filteredUsers.map((user) => {
            const roleInfo = getRoleInfo(user.role);
            return (
              <div
                key={user.id}
                onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                className={`bg-slate-700 rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-600 ${selectedUser === user.id ? 'ring-2 ring-blue-500' : ''
                  }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{user.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-white font-medium">{user.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                        {roleInfo && (
                          <span className={`px-2 py-1 rounded-full text-xs ${roleInfo.color}`}>
                            {user.role}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-400">
                          <Mail size={14} className="mr-2" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Phone size={14} className="mr-2" />
                          {user.phone}
                        </div>
                        <div className="text-gray-400">
                          {user.department}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Last login: {user.lastLogin}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-white">
                      <Edit size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                {selectedUser === user.id && (
                  <div className="mt-4 pt-4 border-t border-slate-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-white font-medium mb-2">Permissions</h5>
                        <div className="flex flex-wrap gap-2">
                          {user.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-white font-medium mb-2">Quick Actions</h5>
                        <div className="flex flex-wrap gap-2">
                          <button className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-white text-xs">
                            Reset Password
                          </button>
                          <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white text-xs">
                            Suspend
                          </button>
                          <button className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-lg text-white text-xs">
                            View Activity
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Role Management */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Role & Permissions Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role) => (
            <div key={role.name} className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">{role.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs ${role.color}`}>
                  {users.filter(user => user.role === role.name).length}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{role.description}</p>
              <div className="space-y-1">
                {role.permissions.map((permission) => (
                  <div key={permission} className="flex items-center text-xs">
                    <Shield size={12} className="mr-2 text-blue-400" />
                    <span className="text-gray-300 capitalize">{permission}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}