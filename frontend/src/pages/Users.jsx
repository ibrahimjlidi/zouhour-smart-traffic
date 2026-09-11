import { useEffect, useState } from 'react'
import axios from 'axios'
import { Users as UsersIcon, Plus, Edit2, Trash2, Search, AlertCircle } from 'lucide-react'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    role: 'ResponsableReseau'
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/utilisateurs')
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.utilisateurs)
          ? res.data.utilisateurs
          : Array.isArray(res.data?.users)
            ? res.data.users
            : Array.isArray(res.data?.data)
              ? res.data.data
              : []
      setUsers(list)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching users')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axios.put(`/api/utilisateurs/${editingId}`, formData)
      } else {
        await axios.post('/api/utilisateurs/register', formData)
      }
      setFormData({ nom: '', email: '', motDePasse: '', role: 'ResponsableReseau' })
      setEditingId(null)
      setShowForm(false)
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving user')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`/api/utilisateurs/${id}`)
        fetchUsers()
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting user')
      }
    }
  }

  const handleEdit = (user) => {
    setFormData({
      nom: user.nom,
      email: user.email,
      motDePasse: '',
      role: user.role
    })
    setEditingId(user._id)
    setShowForm(true)
  }

  const filteredUsers = users.filter(user =>
    user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <UsersIcon className="text-blue-600" size={32} />
            Users Management
          </h1>
          <p className="text-gray-600 mt-1">Manage system users and their roles</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (!showForm) {
              setFormData({ nom: '', email: '', motDePasse: '', role: 'ResponsableReseau' })
              setEditingId(null)
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition"
        >
          <Plus size={20} />
          Add User
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
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit User' : 'Add New User'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.motDePasse}
              onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ResponsableReseau">Network Manager</option>
              <option value="AdministrateurReseau">Network Admin</option>
            </select>
            <div className="col-span-1 md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {editingId ? 'Update User' : 'Create User'}
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

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Users List */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No users found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {user.nom[0]}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-800">{user.nom}</h3>
              <p className="text-sm text-gray-600 truncate">{user.email}</p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Joined: {new Date(user.dateCreation).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
