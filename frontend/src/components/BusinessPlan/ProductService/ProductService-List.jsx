import { Package, Plus, Eye, Edit3, Trash2, Loader, RefreshCw, X, DollarSign, Star, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ProductServiceList = ({ 
    products, 
    onView, 
    onEdit, 
    onDelete, 
    onCreateNew,
    isLoading,
    error,
    onRetry
}) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (productId, productName) => {
        setProductToDelete({ id: productId, name: productName });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!productToDelete) return;

        setIsDeleting(true);
        try {
            await onDelete(productToDelete.id);
            toast.success('Data produk/layanan berhasil dihapus!');
        } catch (error) {
            toast.error('Gagal menghapus data produk/layanan!');
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
            setProductToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
    };

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

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Produk & Layanan</h1>
                        <p className="text-gray-600 dark:text-gray-400">Kelola produk dan layanan bisnis Anda</p>
                    </div>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="text-center">
                        <Loader className="animate-spin h-8 w-8 text-green-600 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Memuat data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Produk & Layanan</h1>
                        <p className="text-gray-600 dark:text-gray-400">Kelola produk dan layanan bisnis Anda</p>
                    </div>
                </div>
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Gagal Memuat Data</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                        {error}
                    </p>
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors mx-auto"
                    >
                        <RefreshCw size={16} />
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Modal Konfirmasi Delete */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.25)] border border-gray-200 dark:border-gray-700 max-w-md w-full p-6 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Konfirmasi Hapus
                            </h3>
                            <button
                                onClick={handleCancelDelete}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-6 text-center">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                                <Trash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                Apakah Anda yakin ingin menghapus produk/layanan ini?
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <strong>"{productToDelete?.name}"</strong>
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Menghapus...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} />
                                        Delete
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Produk & Layanan</h1>
                    <p className="text-gray-600 dark:text-gray-400">Kelola produk dan layanan bisnis Anda</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Tambah Produk/Layanan
                </button>
            </div>

            {/* LIST PRODUK/LAYANAN */}
            {products.length === 0 ? (
                <div className="text-center py-12">
                    <Package size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum ada data produk/layanan</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Mulai dengan menambahkan produk/layanan pertama Anda</p>
                    <button
                        onClick={onCreateNew}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Tambah Produk/Layanan Pertama
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => {
                        const statusBadge = getStatusBadge(product.status);
                        const typeBadge = getTypeBadge(product.type);
                        
                        return (
                            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                                {/* Header dengan gambar */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center border border-blue-200 dark:border-blue-800">
                                            <Package className="text-blue-600 dark:text-blue-400" size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`text-xs px-2 py-1 rounded ${typeBadge.color}`}>
                                                    {typeBadge.label}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded ${statusBadge.color}`}>
                                                    {statusBadge.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Deskripsi */}
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 min-h-[40px]">
                                    {product.description}
                                </p>

                                {/* Harga */}
                                {product.price && (
                                    <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-3">
                                        <DollarSign size={16} className="text-green-600" />
                                        <span className="font-semibold">{formatPrice(product.price)}</span>
                                    </div>
                                )}

                                {/* Keunggulan */}
                                {product.advantages && (
                                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        <Star size={16} className="mt-0.5 flex-shrink-0 text-yellow-500" />
                                        <span className="line-clamp-2">{product.advantages}</span>
                                    </div>
                                )}

                                {/* Strategi Pengembangan */}
                                {product.development_strategy && (
                                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        <TrendingUp size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
                                        <span className="line-clamp-2">{product.development_strategy}</span>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onView(product)}
                                        className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <Eye size={16} />
                                        Lihat
                                    </button>
                                    <button
                                        onClick={() => onEdit(product)}
                                        className="flex-1 bg-yellow-600 text-white py-2 px-3 rounded text-sm hover:bg-yellow-700 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <Edit3 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(product.id, product.name)}
                                        className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ProductServiceList;