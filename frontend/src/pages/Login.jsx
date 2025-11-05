import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Sun, Moon, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Login = ({ isDarkMode, toggleDarkMode }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        login: '', // bisa email atau username
        password: ''
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        const result = await login(formData)

        if (result.success) {
            navigate('/dashboard')
        } else {
            setError(result.message)
        }

        setIsLoading(false)
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        setError('') // Clear error when user types
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {/* Back to Home */}
            <div className="absolute top-6 left-6">
                <Link
                    to="/"
                    className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                >
                    <ArrowLeft size={16} className="mr-2" />
                    Kembali ke Beranda
                </Link>
            </div>

            {/* Dark Mode Toggle */}
            <div className="absolute top-6 right-6">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo */}
                <div className="text-center">
                    <Link to="/" className="inline-block">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            <span className="text-green-600 dark:text-green-400">Plan</span>Web
                        </h1>
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Business Management</p>
                </div>

                <h2 className="mt-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
                    Masuk ke Akun Anda
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Atau{' '}
                    <Link
                        to="/register"
                        className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 transition-colors"
                    >
                        buat akun baru
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg sm:rounded-xl sm:px-10 border border-gray-200 dark:border-gray-700">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="login" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email atau Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="login"
                                    name="login"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={formData.login}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm transition-colors"
                                    placeholder="email@example.com atau username"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm pr-10 transition-colors"
                                    placeholder="Masukkan password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                    Ingat saya
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 transition-colors">
                                    Lupa password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Memproses...
                                    </>
                                ) : (
                                    'Masuk'
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Register Prompt */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Belum punya akun?</span>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <Link
                                to="/register"
                                className="inline-flex items-center text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-500 transition-colors"
                            >
                                Daftar akun baru
                                <ArrowLeft size={16} className="ml-1 rotate-180" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login