import { Edit3, Package, DollarSign, Star, TrendingUp, Building, Calendar, Tag } from 'lucide-react';

const ProductServiceView = ({ product, onBack, onEdit }) => {
    if (!product) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    // Format currency
    const formatPrice = (price) => {
        if (!price) return 'Gratis';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    // Get status badge color
    const getStatusBadge = (status) => {
        const statusConfig = {
            draft: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', label: 'Draft' },
            in_development: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', label: 'Dalam Pengembangan' },
            launched: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', label: 'Diluncurkan' }
        };
        return statusConfig[status] || statusConfig.draft;
    };

    // Get type badge color
    const getTypeBadge = (type) => {
        const typeConfig = {
            product: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', label: 'Produk' },
            service: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300', label: 'Layanan' }
        };
        return typeConfig[type] || typeConfig.product;
    };

    const statusBadge = getStatusBadge(product.status);
    const typeBadge = getTypeBadge(product.type);

    return (
        <div className="space-y-6">
            {/* Header Section dengan tombol back di atas */}
            <div className="mb-2">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>
                
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Produk/Layanan</h1>
                        <p className="text-gray-600 dark:text-gray-400">Lihat detail lengkap produk/layanan</p>
                    </div>
                    <button
                        onClick={() => onEdit(product)}
                        className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                    >
                        <Edit3 size={16} />
                        Edit
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-8">
                
                {/* Header */}
                <div className="flex items-start gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex-shrink-0">
                        <div className="w-24 h-24 border-2 border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20">
                            <Package className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {product.name}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className={`px-3 py-1 rounded-full flex items-center gap-1 ${typeBadge.color}`}>
                                <Tag size={14} />
                                {typeBadge.label}
                            </span>
                            <span className={`px-3 py-1 rounded-full flex items-center gap-1 ${statusBadge.color}`}>
                                <Building size={14} />
                                {statusBadge.label}
                            </span>
                            <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full flex items-center gap-1">
                                <Calendar size={14} />
                                Diperbarui: {new Date(product.updated_at).toLocaleDateString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Gambar Produk */}
                {product.image_path && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Package size={20} />
                            Gambar Produk
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                            <img 
                                src={`/storage/${product.image_path}`} 
                                alt={product.name}
                                className="max-w-xs max-h-64 object-cover rounded-lg mx-auto"
                            />
                        </div>
                    </div>
                )}

                {/* Deskripsi */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Package size={20} />
                        Deskripsi
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <p className="text-gray-900 dark:text-white whitespace-pre-line leading-relaxed">
                            {product.description}
                        </p>
                    </div>
                </div>

                {/* Harga */}
                {product.price && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <DollarSign size={20} />
                            Harga
                        </h3>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                                {formatPrice(product.price)}
                            </p>
                        </div>
                    </div>
                )}

                {/* Keunggulan */}
                {product.advantages && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <Star size={20} />
                            Keunggulan
                        </h3>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                            <p className="text-gray-900 dark:text-white whitespace-pre-line">
                                {product.advantages}
                            </p>
                        </div>
                    </div>
                )}

                {/* Strategi Pengembangan */}
                {product.development_strategy && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <TrendingUp size={20} />
                            Strategi Pengembangan
                        </h3>
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                            <p className="text-gray-900 dark:text-white whitespace-pre-line">
                                {product.development_strategy}
                            </p>
                        </div>
                    </div>
                )}

                {/* Action Buttons di bagian bawah */}
                <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="flex-1 bg-yellow-600 text-white py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Edit3 size={16} />
                        Edit Produk/Layanan
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductServiceView;