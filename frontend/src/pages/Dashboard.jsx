import { useEffect, useState } from 'react'
import axios from 'axios'
import { Users, BookOpen, AlertCircle, FileText, HardDrive, TrendingUp } from 'lucide-react'

export default function Dashboard({ user }) {
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    alerts: 0,
    reports: 0,
    files: 0
  })
  const [recentAlerts, setRecentAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [usersRes, coursesRes, alertsRes, reportsRes, filesRes] = await Promise.all([
        axios.get('/api/utilisateurs').catch(() => ({ data: [] })),
        axios.get('/api/cours').catch(() => ({ data: [] })),
        axios.get('/api/alertes').catch(() => ({ data: [] })),
        axios.get('/api/rapports').catch(() => ({ data: [] })),
        axios.get('/api/fichiers').catch(() => ({ data: [] }))
      ])

      setStats({
        users: usersRes.data?.length || 0,
        courses: coursesRes.data?.length || 0,
        alerts: alertsRes.data?.length || 0,
        reports: reportsRes.data?.length || 0,
        files: filesRes.data?.length || 0
      })

      if (alertsRes.data?.length > 0) {
        setRecentAlerts(alertsRes.data.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`bg-gradient-to-br ${color} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90">{label}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-lg">
          <Icon size={28} />
        </div>
      </div>
    </div>
  )

  const getAlertColor = (type) => {
    switch (type) {
      case 'attaque':
        return 'bg-red-50 border-red-200 text-red-800'
      case 'anomalie':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'systeme':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-green-50 border-green-200 text-green-800'
    }
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome, {user?.email?.split('@')[0]}! 👋</h1>
        <p className="text-blue-100">Here's an overview of your network management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats.users}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={BookOpen}
          label="Courses"
          value={stats.courses}
          color="from-green-500 to-green-600"
        />
        <StatCard
          icon={AlertCircle}
          label="Alerts"
          value={stats.alerts}
          color="from-red-500 to-red-600"
        />
        <StatCard
          icon={FileText}
          label="Reports"
          value={stats.reports}
          color="from-purple-500 to-purple-600"
        />
        <StatCard
          icon={HardDrive}
          label="Network Files"
          value={stats.files}
          color="from-orange-500 to-orange-600"
        />
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertCircle className="text-red-500" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Recent Alerts</h2>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading alerts...</div>
        ) : recentAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No recent alerts</div>
        ) : (
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert._id || alert.id}
                className={`border-l-4 rounded-lg p-4 ${getAlertColor(alert.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{alert.message || 'Alert'}</p>
                    <p className="text-sm opacity-75 mt-1">
                      To: {alert.destinataire} | Type: {alert.type}
                    </p>
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(alert.dateEnvoi).toLocaleString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    alert.statut === 'lue' ? 'bg-green-200' : 'bg-yellow-200'
                  }`}>
                    {alert.statut}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
            <TrendingUp className="text-blue-500 mb-2" size={24} />
            <p className="text-sm text-gray-600">System Status</p>
            <p className="text-2xl font-bold text-green-600 mt-2">Operational</p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
            <TrendingUp className="text-purple-500 mb-2" size={24} />
            <p className="text-sm text-gray-600">Network Health</p>
            <p className="text-2xl font-bold text-green-600 mt-2">100%</p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
            <TrendingUp className="text-orange-500 mb-2" size={24} />
            <p className="text-sm text-gray-600">Uptime</p>
            <p className="text-2xl font-bold text-green-600 mt-2">99.8%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
