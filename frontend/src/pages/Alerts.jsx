import { useEffect, useState } from 'react'
import axios from 'axios'
import { AlertCircle, Plus, Trash2, Search, Eye, AlertTriangle, CheckCircle, Info } from 'lucide-react'

export default function Alerts() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    destinataire: '',
    message: '',
    type: 'information'
  })
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/alertes')
      // backend may return { success, alertes } or an array
      const incoming = res.data?.alertes || res.data?.data || res.data || []
      setAlerts(Array.isArray(incoming) ? incoming : [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching alerts')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/alertes/envoyer', formData)
      setFormData({ destinataire: '', message: '', type: 'information' })
      setShowForm(false)
      fetchAlerts()
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating alert')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this alert?')) {
      try {
        await axios.delete(`/api/alertes/${id}`)
        fetchAlerts()
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting alert')
      }
    }
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'attaque':
        return <AlertTriangle className="text-red-600" size={24} />
      case 'anomalie':
        return <AlertCircle className="text-yellow-600" size={24} />
      case 'systeme':
        return <Info className="text-blue-600" size={24} />
      default:
        return <CheckCircle className="text-green-600" size={24} />
    }
  }

  const getAlertStyles = (type) => {
    switch (type) {
      case 'attaque':
        return 'bg-red-50 border-red-200'
      case 'anomalie':
        return 'bg-yellow-50 border-yellow-200'
      case 'systeme':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-green-50 border-green-200'
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = 
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.destinataire.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || alert.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <AlertCircle className="text-red-600" size={32} />
            Alerts Management
          </h1>
          <p className="text-gray-600 mt-1">Monitor and manage network alerts</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (!showForm) {
              setFormData({ destinataire: '', message: '', type: 'information' })
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition"
        >
          <Plus size={20} />
          Create Alert
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Create New Alert</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Recipient Email"
              value={formData.destinataire}
              onChange={(e) => setFormData({ ...formData, destinataire: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <textarea
              placeholder="Alert Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="3"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            ></textarea>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="information">Information</option>
              <option value="anomalie">Anomaly</option>
              <option value="systeme">System</option>
              <option value="attaque">Attack</option>
            </select>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Create Alert
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="all">All Types</option>
          <option value="attaque">Attack</option>
          <option value="anomalie">Anomaly</option>
          <option value="systeme">System</option>
          <option value="information">Information</option>
        </select>
      </div>

      {/* Alerts List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading alerts...</div>
      ) : filteredAlerts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No alerts found</div>
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <div
              key={alert._id || alert.id}
              className={`rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 ${getAlertStyles(alert.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-gray-800">{alert.message}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        alert.statut === 'lue' 
                          ? 'bg-green-200 text-green-800' 
                          : alert.statut === 'envoyee'
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {alert.statut}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>To:</strong> {alert.destinataire}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(alert.dateEnvoi).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(alert._id || alert.id)}
                  className="p-2 hover:bg-red-200 rounded-lg transition text-red-600 flex-shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
