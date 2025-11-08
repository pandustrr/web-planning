import { Upload, X, Building, Loader, Package, DollarSign, Star, TrendingUp } from 'lucide-react';

const ProductServiceForm = ({
    title,
    subtitle,
    formData,
    businesses,
    isLoadingBusinesses,
    isLoading,
    onInputChange,
    onFileChange,
    onSubmit,
    onBack,
    submitButtonText,
    submitButtonIcon,
    mode = 'create',
    existingProduct
}) => {
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
                
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
                </div>
            </div>

            <form onSubmit={onSubmit}>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                    
                    {/* Pilih Bisnis */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pilih Bisnis *
                        </label>
                        {isLoadingBusinesses ? (
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                                <Loader className="animate-spin h-4 w-4" />
                                <span>Memuat data bisnis...</span>
                            </div>
                        ) : businesses.length === 0 ? (
                            <div className="text-center py-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                <Building className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    Belum ada data bisnis. Silakan buat latar belakang bisnis terlebih dahulu.
                                </p>
                            </div>
                        ) : (
                            <select
                                name="business_background_id"
                                value={formData.business_background_id}
                                onChange={onInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                            >
                                <option value="">Pilih Bisnis</option>
                                {businesses.map((business) => (
                                    <option key={business.id} value={business.id}>
                                        {business.name} - {business.category}
                                    </option>
                                ))}
                            </select>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Pilih bisnis yang terkait dengan produk/layanan ini
                        </p>
                    </div>

                    {/* Tipe Produk/Layanan */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tipe *
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="type"
                                    value="product"
                                    checked={formData.type === 'product'}
                                    onChange={onInputChange}
                                    className="mr-2"
                                />
                                <span>Produk</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="type"
                                    value="service"
                                    checked={formData.type === 'service'}
                                    onChange={onInputChange}
                                    className="mr-2"
                                />
                                <span>Layanan</span>
                            </label>
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={onInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                            <option value="draft">Draft</option>
                            <option value="in_development">Dalam Pengembangan</option>
                            <option value="launched">Diluncurkan</option>
                        </select>
                    </div>

                    {/* Nama Produk/Layanan */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nama Produk/Layanan *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onInputChange}
                            placeholder="Masukkan nama produk atau layanan"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    {/* Deskripsi */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Deskripsi *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={onInputChange}
                            rows={4}
                            placeholder="Jelaskan detail produk atau layanan Anda"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            required
                        />
                    </div>

                    {/* Harga */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Harga (Opsional)
                        </label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={onInputChange}
                                placeholder="0"
                                min="0"
                                step="0.01"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Kosongkan jika gratis atau belum ditentukan
                        </p>
                    </div>

                    {/* Upload Gambar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Gambar Produk (Opsional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center">
                            <input
                                type="file"
                                name="image_path"
                                onChange={onFileChange}
                                accept="image/*"
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Klik untuk upload gambar
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Format: JPEG, PNG, GIF (Maks. 2MB)
                                </p>
                            </label>
                        </div>
                        {existingProduct?.image_path && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Gambar saat ini:</p>
                                <img 
                                    src={`/storage/${existingProduct.image_path}`} 
                                    alt="Current product" 
                                    className="w-32 h-32 object-cover rounded-lg"
                                />
                            </div>
                        )}
                    </div>

                    {/* Keunggulan */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Keunggulan (Opsional)
                        </label>
                        <div className="relative">
                            <Star className="absolute left-3 top-3 text-gray-400" size={16} />
                            <textarea
                                name="advantages"
                                value={formData.advantages}
                                onChange={onInputChange}
                                rows={3}
                                placeholder="Apa keunggulan produk/layanan Anda dibandingkan kompetitor?"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Strategi Pengembangan */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Strategi Pengembangan (Opsional)
                        </label>
                        <div className="relative">
                            <TrendingUp className="absolute left-3 top-3 text-gray-400" size={16} />
                            <textarea
                                name="development_strategy"
                                value={formData.development_strategy}
                                onChange={onInputChange}
                                rows={3}
                                placeholder="Bagaimana rencana pengembangan produk/layanan ke depan?"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onBack}
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || isLoadingBusinesses || businesses.length === 0}
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    {submitButtonIcon}
                                    {submitButtonText}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProductServiceForm;