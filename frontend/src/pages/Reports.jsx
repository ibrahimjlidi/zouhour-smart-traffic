import { useEffect, useState } from 'react'
import axios from 'axios'
import { FileText, Plus, Trash2, Download, Search, AlertCircle, Filter } from 'lucide-react'

export default function Reports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    titre: '',
    type: 'PDF',
    contenu: ''
  })
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/rapports')
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.rapports)
          ? res.data.rapports
          : Array.isArray(res.data?.reports)
            ? res.data.reports
            : Array.isArray(res.data?.data)
              ? res.data.data
              : []
      setReports(list)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching reports')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/rapports/generer', formData)
      setFormData({ titre: '', type: 'PDF', contenu: '' })
      setShowForm(false)
      fetchReports()
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating report')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this report?')) {
      try {
        await axios.delete(`/api/rapports/${id}`)
        fetchReports()
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting report')
      }
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'PDF':
        return 'bg-red-100 text-red-800'
      case 'CSV':
        return 'bg-blue-100 text-blue-800'
      case 'EXCEL':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.titre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || report.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="text-purple-600" size={32} />
            Reports Management
          </h1>
          <p className="text-gray-600 mt-1">Generate and manage system reports</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (!showForm) {
              setFormData({ titre: '', type: 'PDF', contenu: '' })
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition"
        >
          <Plus size={20} />
          Generate Report
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
          <h2 className="text-xl font-bold mb-4">Generate New Report</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Report Title"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="PDF">PDF</option>
              <option value="CSV">CSV</option>
              <option value="EXCEL">EXCEL</option>
            </select>
            <textarea
              placeholder="Report Content"
              value={formData.contenu}
              onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Generate Report
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
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Types</option>
          <option value="PDF">PDF</option>
          <option value="CSV">CSV</option>
          <option value="EXCEL">EXCEL</option>
        </select>
      </div>

      {/* Reports Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading reports...</div>
      ) : filteredReports.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No reports found</div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Generated Date</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, index) => (
                  <tr
                    key={report._id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="text-purple-600" size={20} />
                        <span className="font-medium text-gray-800">{report.titre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(report.dateGeneration).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(report._id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
