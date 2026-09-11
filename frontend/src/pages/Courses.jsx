import { useEffect, useState } from 'react'
import axios from 'axios'
import { BookOpen, Plus, Edit2, Trash2, Search, AlertCircle, FileText } from 'lucide-react'

export default function Courses() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    niveau: 'Beginner',
    categorie: 'Networking',
    pdf: ''
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/cours')
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.cours)
          ? res.data.cours
          : Array.isArray(res.data?.data)
            ? res.data.data
            : []
      setCourses(list)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching courses')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axios.put(`/api/cours/${editingId}`, formData)
      } else {
        await axios.post('/api/cours', formData)
      }
      setFormData({ titre: '', description: '', niveau: 'Beginner', categorie: 'Networking', pdf: '' })
      setEditingId(null)
      setShowForm(false)
      fetchCourses()
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving course')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`/api/cours/${id}`)
        fetchCourses()
      } catch (err) {
        setError(err.response?.data?.message || 'Error deleting course')
      }
    }
  }

  const handleEdit = (course) => {
    setFormData({
      titre: course.titre,
      description: course.description,
      niveau: course.niveau,
      categorie: course.categorie,
      pdf: course.pdf || ''
    })
    setEditingId(course._id)
    setShowForm(true)
  }

  const filteredCourses = courses.filter(course =>
    course.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.categorie.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-green-600" size={32} />
            Courses Management
          </h1>
          <p className="text-gray-600 mt-1">Create and manage training courses</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (!showForm) {
              setFormData({ titre: '', description: '', niveau: 'Beginner', categorie: 'Networking', pdf: '' })
              setEditingId(null)
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition"
        >
          <Plus size={20} />
          Add Course
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
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Course' : 'Add New Course'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Course Title"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              placeholder="Course Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            ></textarea>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.niveau}
                onChange={(e) => setFormData({ ...formData, niveau: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <select
                value={formData.categorie}
                onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="Networking">Networking</option>
                <option value="Security">Security</option>
                <option value="Administration">Administration</option>
                <option value="Monitoring">Monitoring</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="PDF URL (optional)"
              value={formData.pdf}
              onChange={(e) => setFormData({ ...formData, pdf: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {editingId ? 'Update Course' : 'Create Course'}
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
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading courses...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No courses found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden border border-gray-200">
              <div className="h-32 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <BookOpen className="text-white" size={48} />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-800 mb-2">{course.titre}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                    {course.niveau}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded">
                    {course.categorie}
                  </span>
                </div>
                {course.pdf && (
                  <div className="mb-4 flex items-center gap-2 text-green-600 text-sm">
                    <FileText size={16} />
                    PDF Available
                  </div>
                )}
                <div className="flex gap-2 border-t border-gray-200 pt-4">
                  <button
                    onClick={() => handleEdit(course)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 hover:bg-blue-50 rounded-lg transition text-blue-600"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 hover:bg-red-50 rounded-lg transition text-red-600"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
