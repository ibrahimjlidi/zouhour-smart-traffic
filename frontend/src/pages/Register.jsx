import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus, AlertCircle, ArrowRight } from 'lucide-react'

export default function Register({ onRegister }) {
  const [form, setForm] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    confirmPassword: '',
    role: 'ResponsableReseau'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.motDePasse !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)

    try {
      // Register
      await axios.post('/api/utilisateurs/register', {
        nom: form.nom,
        email: form.email,
        motDePasse: form.motDePasse,
        role: form.role
      })

      // Auto login
      const loginResponse = await axios.post('/api/utilisateurs/login', {
        email: form.email,
        motDePasse: form.motDePasse
      })

      const token = loginResponse.data.token
      const { parseJwt } = await import('../utils/jwt')
      const payload = parseJwt(token) || {}

      onRegister(token, {
        id: payload.id || payload._id || payload.sub || form.email,
        email: form.email,
        nom: form.nom,
        role: payload.role || form.role
      })

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg mb-4">
              <UserPlus className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-purple-100">Join Smart Network Management</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-100 mb-2">Full Name</label>
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-100 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-100 mb-2">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              >
                <option value="ResponsableReseau" className="bg-slate-900">Network Manager</option>
                <option value="AdministrateurReseau" className="bg-slate-900">Network Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-100 mb-2">Password</label>
              <input
                type="password"
                name="motDePasse"
                value={form.motDePasse}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-100 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold rounded-lg transition duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-center text-purple-200 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-300 hover:text-purple-200 font-semibold transition">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
