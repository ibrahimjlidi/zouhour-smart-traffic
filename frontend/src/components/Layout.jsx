import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, LogOut, LayoutDashboard, Users, BookOpen, AlertCircle, FileText, HardDrive, Settings } from 'lucide-react'

export default function Layout({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Users', icon: Users, path: '/users' },
    { label: 'Courses', icon: BookOpen, path: '/courses' },
    { label: 'Alerts', icon: AlertCircle, path: '/alerts' },
    { label: 'Reports', icon: FileText, path: '/reports' },
    { label: 'Network Files', icon: HardDrive, path: '/files' },
  ]

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col shadow-xl`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">SMART</h1>
              <p className="text-xs text-slate-400">Network Traffic</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition duration-200 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-slate-700 space-y-3">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{user?.email}</p>
                <p className="text-xs text-slate-400 truncate">{user?.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-200 transition duration-200 text-sm"
          >
            <LogOut size={16} />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Smart Network Traffic Management</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your network resources and monitoring</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">{user?.email}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role?.replace(/([A-Z])/g, ' $1')}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
