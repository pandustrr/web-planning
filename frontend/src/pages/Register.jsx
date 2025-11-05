import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Sun, Moon, ArrowLeft, CheckCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Register = ({ isDarkMode, toggleDarkMode }) => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
        acceptTerms: false
    })
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})

        if (!formData.acceptTerms) {
            setErrors({ acceptTerms: 'Anda harus menyetujui syarat dan ketentuan' })
            return
        }

        setIsLoading(true)

        const result = await register(formData)

        if (result.success) {
            navigate('/dashboard')
        } else {
            if (result.errors) {
                setErrors(result.errors)
            } else {
                setErrors({ general: result.message })
            }
        }

        setIsLoading(false)
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        })

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '' }))
        }
    }

    const passwordStrength = formData.password.length > 0 ?
        formData.password.length < 6 ? 'weak' :
            formData.password.length < 10 ? 'medium' : 'strong'
        : ''

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
                    Buat Akun Baru
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Atau{' '}
                    <Link
                        to="/login"
                        className="font-medium text-green-600 dark:text-green-400 hover:text-green-500 transition-colors"
                    >
                        masuk ke akun yang sudah ada
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg sm:rounded-xl sm:px-10 border border-gray-200 dark:border-gray-700">
                    {/* General Error */}
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Nama Lengkap
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm transition-colors ${errors.name ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    placeholder="John Doe"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name[0]}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Alamat Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm transition-colors ${errors.email ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    placeholder="email@example.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email[0]}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Username
                            </label>
                            <div className="mt-1">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm transition-colors ${errors.username ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    placeholder="username"
                                />
                                {errors.username && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username[0]}</p>
                                )}
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
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm pr-10 transition-colors ${errors.password ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    placeholder="Minimal 8 karakter"
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
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password[0]}</p>
                            )}
                            {passwordStrength && !errors.password && (
                                <div className="mt-2">
                                    <div className={`text-xs ${passwordStrength === 'weak' ? 'text-red-500' :
                                            passwordStrength === 'medium' ? 'text-yellow-500' : 'text-green-500'
                                        }`}>
                                        Kekuatan password: {
                                            passwordStrength === 'weak' ? 'Lemah' :
                                                passwordStrength === 'medium' ? 'Sedang' : 'Kuat'
                                        }
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Konfirmasi Password
                            </label>
                            <div className="mt-1 relative">
                                <input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    className={`appearance-none block w-full px-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm pr-10 transition-colors ${errors.password_confirmation ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    placeholder="Ulangi password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password_confirmation[0]}</p>
                            )}
                        </div>

                        <div className="flex items-start">
                            <input
                                id="acceptTerms"
                                name="acceptTerms"
                                type="checkbox"
                                required
                                checked={formData.acceptTerms}
                                onChange={handleChange}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded mt-1"
                            />
                            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Saya menyetujui{' '}
                                <a href="#" className="text-green-600 dark:text-green-400 hover:text-green-500 transition-colors">
                                    Syarat & Ketentuan
                                </a>{' '}
                                dan{' '}
                                <a href="#" className="text-green-600 dark:text-green-400 hover:text-green-500 transition-colors">
                                    Kebijakan Privasi
                                </a>
                            </label>
                        </div>
                        {errors.acceptTerms && (
                            <p className="text-sm text-red-600 dark:text-red-400">{errors.acceptTerms}</p>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Membuat Akun...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2" size={16} />
                                        Buat Akun
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register