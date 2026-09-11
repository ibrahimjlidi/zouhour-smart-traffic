import { useEffect, useState } from 'react'
import axios from 'axios'
import { HardDrive, Plus, Trash2, Download, Search, AlertCircle, Activity, Filter } from 'lucide-react'

export default function Files() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nomFichier: '',
    typeFichier: 'PCAP',
    taille: 0,
    cheminFichier: ''
  })
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/fichiers')
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.fichiers)
          ? res.data.fichiers
          : Array.isArray(res.data?.files)
            ? res.data.files
            : Array.isArray(res.data?.data)
              ? res.data.data
              : []
      setFiles(list)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching files')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/fichiers', formData)
      setFormData({ nomFichier: '', typeFichier: 'PCAP', taille: 0, cheminFichier: '' })
      setShowForm(false)
      fetchFiles()
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading file')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this file?')) {
      try {
        await axios.delete(`/api/fichiers/${id}`)
        fetchFiles()
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting file')
      }
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Importé':
        return 'bg-green-100 text-green-800'
      case 'En cours d\'analyse':
        return 'bg-blue-100 text-blue-800'
      case 'Analysé':
        return 'bg-purple-100 text-purple-800'
      case 'Erreur':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'En cours d\'analyse':
        return <Activity className="animate-spin" size={16} />
      case 'Analysé':
        return '✓'
      case 'Erreur':
        return '✕'
      default:
        return '◆'
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.nomFichier.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || file.statut === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <HardDrive className="text-orange-600" size={32} />
            Network Files Management
          </h1>
          <p className="text-gray-600 mt-1">Manage and analyze network traffic files</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (!showForm) {
              setFormData({ nomFichier: '', typeFichier: 'PCAP', taille: 0, cheminFichier: '' })
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:shadow-lg transition"
        >
          <Plus size={20} />
          Upload File
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
          <h2 className="text-xl font-bold mb-4">Upload Network File</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="File Name"
              value={formData.nomFichier}
              onChange={(e) => setFormData({ ...formData, nomFichier: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.typeFichier}
                onChange={(e) => setFormData({ ...formData, typeFichier: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="PCAP">PCAP</option>
                <option value="PCAPNG">PCAPNG</option>
                <option value="CSV">CSV</option>
              </select>
              <input
                type="number"
                placeholder="File Size (bytes)"
                value={formData.taille}
                onChange={(e) => setFormData({ ...formData, taille: parseInt(e.target.value) })}
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <input
              type="text"
              placeholder="File Path"
              value={formData.cheminFichier}
              onChange={(e) => setFormData({ ...formData, cheminFichier: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
              >
                Upload File
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
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Status</option>
          <option value="Importé">Imported</option>
          <option value="En cours d'analyse">Analyzing</option>
          <option value="Analysé">Analyzed</option>
          <option value="Erreur">Error</option>
        </select>
      </div>

      {/* Files List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading files...</div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No files found</div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">File Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Size</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Imported Date</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file, index) => (
                  <tr
                    key={file._id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <HardDrive className="text-orange-600" size={20} />
                        <span className="font-medium text-gray-800">{file.nomFichier}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                        {file.typeFichier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatFileSize(file.taille)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-2 ${getStatusColor(file.statut)}`}>
                        {getStatusIcon(file.statut)}
                        {file.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(file.dateImport).toLocaleDateString()}
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
                          onClick={() => handleDelete(file._id)}
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
