import { useState, useEffect } from 'react';
import { Download, Eye, FileText, Crown, Zap } from 'lucide-react';

const PdfBusinessPlan = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;
    const token = localStorage.getItem('token');
    const API_BASE_URL = 'http://localhost:8000/api';

    // Create hidden iframe once on mount
    useEffect(() => {
        // Check if iframe already exists
        if (!document.getElementById('pdf-download-iframe')) {
            const iframe = document.createElement('iframe');
            iframe.id = 'pdf-download-iframe';
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }

        // Cleanup on unmount
        return () => {
            const iframe = document.getElementById('pdf-download-iframe');
            if (iframe) {
                iframe.remove();
            }
        };
    }, []);

    // Method: Menggunakan Hidden Iframe (100% bypass CORS)
    const handleDownload = (isPro = false) => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        setIsGenerating(true);
        setError(null);
        setSuccess(null);

        try {
            const url = `${API_BASE_URL}/business-plan/generate-pdf?user_id=${userId}&is_pro=${isPro ? 'true' : 'false'}&token=${token}`;
            
            // Get or create hidden iframe
            let iframe = document.getElementById('pdf-download-iframe');
            if (!iframe) {
                iframe = document.createElement('iframe');
                iframe.id = 'pdf-download-iframe';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
            }

            // Set iframe source to trigger download
            iframe.src = url;

            // Set success message after a short delay
            setTimeout(() => {
                setSuccess(`PDF sedang diunduh! ${isPro ? '(Versi Pro - Tanpa Watermark)' : '(Versi Free - Dengan Watermark)'}`);
                setIsGenerating(false);
                setShowModal(false);

                // Clear success message after 5 seconds
                setTimeout(() => {
                    setSuccess(null);
                }, 5000);
            }, 1000);

        } catch (err) {
            console.error('Error generating PDF:', err);
            setError(err.message || 'Terjadi kesalahan saat membuat PDF');
            setIsGenerating(false);
        }
    };

    // Alternative method: Direct window location (will navigate)
    const handleDownloadDirect = (isPro = false) => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        setError(null);
        setSuccess(null);

        try {
            const url = `${API_BASE_URL}/business-plan/generate-pdf?user_id=${userId}&is_pro=${isPro ? 'true' : 'false'}&token=${token}`;
            
            // Direct download via window.location
            window.location.href = url;

            setSuccess(`PDF sedang diunduh! ${isPro ? '(Versi Pro - Tanpa Watermark)' : '(Versi Free - Dengan Watermark)'}`);
            setShowModal(false);

            setTimeout(() => {
                setSuccess(null);
            }, 5000);

        } catch (err) {
            console.error('Error generating PDF:', err);
            setError(err.message || 'Terjadi kesalahan saat membuat PDF');
        }
    };

    const handlePreview = () => {
        if (!userId) {
            setError('User not authenticated');
            return;
        }

        setError(null);

        try {
            const url = `${API_BASE_URL}/business-plan/preview-pdf?user_id=${userId}&is_pro=false&token=${token}`;
            window.open(url, '_blank');
            
        } catch (err) {
            console.error('Error previewing PDF:', err);
            setError(err.message || 'Terjadi kesalahan saat preview PDF');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                        <FileText size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Export Business Plan</h1>
                        <p className="text-green-100">Unduh rencana bisnis Anda dalam format PDF profesional</p>
                    </div>
                </div>
            </div>

            {/* Alert Messages */}
            {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800 dark:text-red-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{error}</span>
                    </div>
                </div>
            )}

            {success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">{success}</span>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Free Version Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Zap className="text-blue-600" size={24} />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Versi Free</h3>
                        </div>
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                            Gratis
                        </span>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">Format PDF Profesional</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">Semua Data Business Plan</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">Gambar & Logo</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-300">Dengan Watermark "SmartPlan Free"</span>
                        </div>
                    </div>

                    <button
                        onClick={() => handleDownload(false)}
                        disabled={isGenerating}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Membuat PDF...</span>
                            </>
                        ) : (
                            <>
                                <Download size={20} />
                                <span>Download Free</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Pro Version Card */}
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl shadow-md border-2 border-yellow-400 dark:border-yellow-600 p-6 hover:shadow-lg transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-4 py-1 rounded-bl-lg font-bold text-sm">
                        PREMIUM
                    </div>

                    <div className="flex items-center justify-between mb-4 mt-4">
                        <div className="flex items-center gap-2">
                            <Crown className="text-yellow-600" size={24} />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Versi Pro</h3>
                        </div>
                        <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Premium
                        </span>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-800 font-medium">Format PDF Profesional</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-800 font-medium">Semua Data Business Plan</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-800 font-medium">Gambar & Logo High Quality</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-800 font-bold">✨ TANPA WATERMARK</span>
                        </div>
                        <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700 dark:text-gray-800 font-medium">Lebih Profesional & Presentable</span>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        disabled={isGenerating}
                        className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Crown size={20} />
                        <span>Download Pro</span>
                    </button>
                </div>
            </div>

            {/* Preview Button */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            Preview PDF
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Lihat tampilan PDF sebelum mengunduh (akan dibuka di tab baru)
                        </p>
                    </div>
                    <button
                        onClick={handlePreview}
                        disabled={isGenerating}
                        className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Eye size={18} />
                        <span>Preview</span>
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Informasi PDF Export
                </h3>
                <ul className="space-y-2 text-sm text-blue-900 dark:text-blue-300">
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span>PDF akan berisi semua data business plan yang sudah Anda buat</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span>Format profesional dengan desain yang rapi dan mudah dibaca</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span>Pastikan semua data sudah lengkap sebelum export</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span>Download akan dimulai otomatis tanpa membuka tab baru</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span>Versi Pro tidak memiliki watermark untuk presentasi yang lebih profesional</span>
                    </li>
                </ul>
            </div>

            {/* Pro Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                                <Crown className="text-yellow-600" size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                Upgrade ke Pro
                            </h3>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Fitur Pro untuk export tanpa watermark akan segera tersedia. 
                            Untuk saat ini, Anda bisa mencoba download versi Pro (demo) 
                            untuk melihat hasil tanpa watermark.
                        </p>

                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                            <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                <strong>Demo Mode:</strong> Fitur pembayaran akan diaktifkan segera. 
                                Saat ini Anda bisa mencoba versi Pro secara gratis.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={isGenerating}
                                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDownload(true)}
                                disabled={isGenerating}
                                className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Download size={18} />
                                        <span>Download Pro</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PdfBusinessPlan;