import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import ProductServiceForm from './ProductService-Form';
import { productServiceApi, backgroundApi } from '../../../services/businessPlan';
import { toast } from 'react-toastify';

const ProductServiceEdit = ({ product, onBack, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [businesses, setBusinesses] = useState([]);
    const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true);

    const [formData, setFormData] = useState({
        business_background_id: '',
        type: 'product',
        name: '',
        description: '',
        price: '',
        image_path: null,
        advantages: '',
        development_strategy: '',
        status: 'draft'
    });

    // Fetch business backgrounds untuk dropdown
    const fetchBusinesses = async () => {
        try {
            setIsLoadingBusinesses(true);
            const user = JSON.parse(localStorage.getItem('user'));
            
            const response = await backgroundApi.getAll({ 
                user_id: user?.id 
            });
            
            if (response.data.status === 'success') {
                setBusinesses(response.data.data || []);
            } else {
                throw new Error(response.data.message || 'Failed to fetch business backgrounds');
            }
        } catch (error) {
            console.error('Error fetching businesses:', error);
            let errorMessage = 'Gagal memuat data bisnis';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setIsLoadingBusinesses(false);
        }
    };

    useEffect(() => {
        fetchBusinesses();
    }, []);

    useEffect(() => {
        if (product) {
            setFormData({
                business_background_id: product.business_background_id || '',
                type: product.type || 'product',
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                image_path: null,
                advantages: product.advantages || '',
                development_strategy: product.development_strategy || '',
                status: product.status || 'draft'
            });
        }
    }, [product]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: value 
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData(prev => ({ 
            ...prev, 
            image_path: file 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi: business background harus dipilih
        if (!formData.business_background_id) {
            toast.error('Pilih bisnis terlebih dahulu');
            return;
        }

        // Validasi: nama dan deskripsi wajib diisi
        if (!formData.name.trim()) {
            toast.error('Nama produk/layanan harus diisi');
            return;
        }

        if (!formData.description.trim()) {
            toast.error('Deskripsi produk/layanan harus diisi');
            return;
        }

        setIsLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            
            if (!user || !user.id) {
                throw new Error('User data not found. Please login again.');
            }

            const submitData = new FormData();
            submitData.append('user_id', user.id);
            submitData.append('business_background_id', formData.business_background_id);
            submitData.append('type', formData.type);
            submitData.append('name', formData.name.trim());
            submitData.append('description', formData.description.trim());
            
            // Only append price if it has value
            if (formData.price && formData.price !== '') {
                submitData.append('price', parseFloat(formData.price));
            } else {
                submitData.append('price', '');
            }
            
            // Only append optional fields if they have values
            if (formData.advantages) {
                submitData.append('advantages', formData.advantages.trim());
            } else {
                submitData.append('advantages', '');
            }
            
            if (formData.development_strategy) {
                submitData.append('development_strategy', formData.development_strategy.trim());
            } else {
                submitData.append('development_strategy', '');
            }
            
            submitData.append('status', formData.status);
            
            // Append file only if selected
            if (formData.image_path) {
                submitData.append('image_path', formData.image_path);
            }

            const response = await productServiceApi.update(product.id, submitData);

            if (response.data.status === 'success') {
                toast.success('Produk/layanan berhasil diperbarui!');
                onSuccess();
            } else {
                throw new Error(response.data.message || 'Terjadi kesalahan saat memperbarui produk/layanan');
            }
        } catch (error) {
            console.error('Error updating product/service:', error);
            
            let errorMessage = 'Terjadi kesalahan saat memperbarui produk/layanan';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors) {
                // Handle validation errors
                const errors = error.response.data.errors;
                const firstError = Object.values(errors)[0];
                errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!product) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return (
        <ProductServiceForm
            title="Edit Produk/Layanan"
            subtitle="Perbarui informasi produk/layanan"
            formData={formData}
            businesses={businesses}
            isLoadingBusinesses={isLoadingBusinesses}
            isLoading={isLoading}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
            onSubmit={handleSubmit}
            onBack={onBack}
            submitButtonText="Perbarui Produk/Layanan"
            submitButtonIcon={<Save size={16} />}
            mode="edit"
            existingProduct={product}
        />
    );
};

export default ProductServiceEdit;