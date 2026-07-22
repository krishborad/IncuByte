import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreateVehiclePayload } from '../services/vehicle.service';
import { Vehicle } from '../types';

interface VehicleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVehiclePayload) => Promise<void>;
  initialData?: Vehicle | null;
  loading?: boolean;
}

export const VehicleFormModal: React.FC<VehicleFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) => {
  const currentYear = new Date().getFullYear();
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formSubmitError, setFormSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateVehiclePayload>({
    defaultValues: {
      make: initialData?.make || '',
      model: initialData?.model || '',
      year: initialData?.year || currentYear,
      price: initialData?.price || 25000,
      mileage: initialData?.mileage || 1000,
      fuelType: initialData?.fuelType || 'Gasoline',
      transmission: initialData?.transmission || 'Automatic',
      stock: initialData?.stock ?? 5,
      image: initialData?.image || '',
      description: initialData?.description || '',
    },
  });

  useEffect(() => {
    setFormSubmitError(null);
    if (initialData) {
      reset({
        make: initialData.make,
        model: initialData.model,
        year: initialData.year,
        price: initialData.price,
        mileage: initialData.mileage,
        fuelType: initialData.fuelType,
        transmission: initialData.transmission,
        stock: initialData.stock,
        image: initialData.image || '',
        description: initialData.description || '',
      });
      setImagePreview(initialData.image || '');
    } else {
      reset({
        make: '',
        model: '',
        year: currentYear,
        price: 25000,
        mileage: 1000,
        fuelType: 'Gasoline',
        transmission: 'Automatic',
        stock: 5,
        image: '',
        description: '',
      });
      setImagePreview('');
    }
  }, [initialData, reset, currentYear, isOpen]);

  const watchImageUrl = watch('image');

  useEffect(() => {
    if (watchImageUrl && watchImageUrl.startsWith('http')) {
      setImagePreview(watchImageUrl);
    }
  }, [watchImageUrl]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setValue('image', result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: CreateVehiclePayload) => {
    setFormSubmitError(null);
    try {
      await onSubmit(data);
    } catch (err: any) {
      setFormSubmitError(err.response?.data?.message || 'Form submission failed. Please check inputs and try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vehicle-modal-title"
      data-testid="vehicle-modal"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl my-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h3 id="vehicle-modal-title" className="text-2xl font-bold text-white">
            {initialData ? 'Edit Vehicle Details' : 'Add New Vehicle to Inventory'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close modal"
            data-testid="modal-close-icon"
          >
            ✕
          </button>
        </div>

        {formSubmitError && (
          <div className="p-4 bg-rose-950/90 border border-rose-800 text-rose-300 rounded-xl text-sm" role="alert">
            {formSubmitError}
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate aria-busy={loading}>
          {/* Make & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="form-make" className="block text-xs font-medium text-slate-300 mb-1">
                Make *
              </label>
              <input
                id="form-make"
                type="text"
                aria-invalid={!!errors.make}
                aria-required="true"
                className={`w-full bg-slate-950 border ${
                  errors.make ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                } text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="e.g. Toyota"
                {...register('make', { required: 'Make is required' })}
              />
              {errors.make && <p className="text-xs text-rose-400 mt-1" role="alert">{errors.make.message}</p>}
            </div>

            <div>
              <label htmlFor="form-model" className="block text-xs font-medium text-slate-300 mb-1">
                Model *
              </label>
              <input
                id="form-model"
                type="text"
                aria-invalid={!!errors.model}
                aria-required="true"
                className={`w-full bg-slate-950 border ${
                  errors.model ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                } text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="e.g. Camry"
                {...register('model', { required: 'Model is required' })}
              />
              {errors.model && <p className="text-xs text-rose-400 mt-1" role="alert">{errors.model.message}</p>}
            </div>
          </div>

          {/* Year, Price, Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="form-year" className="block text-xs font-medium text-slate-300 mb-1">
                Year *
              </label>
              <input
                id="form-year"
                type="number"
                aria-invalid={!!errors.year}
                aria-required="true"
                className={`w-full bg-slate-950 border ${
                  errors.year ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                } text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                {...register('year', {
                  valueAsNumber: true,
                  required: 'Year is required',
                  min: { value: 1900, message: 'Year must be at least 1900' },
                  max: { value: currentYear + 1, message: `Year cannot exceed ${currentYear + 1}` },
                })}
              />
              {errors.year && <p className="text-xs text-rose-400 mt-1" role="alert">{errors.year.message}</p>}
            </div>

            <div>
              <label htmlFor="form-price" className="block text-xs font-medium text-slate-300 mb-1">
                Price ($) *
              </label>
              <input
                id="form-price"
                type="number"
                aria-invalid={!!errors.price}
                aria-required="true"
                className={`w-full bg-slate-950 border ${
                  errors.price ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                } text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                {...register('price', {
                  valueAsNumber: true,
                  required: 'Price is required',
                  min: { value: 0, message: 'Price cannot be negative' },
                })}
              />
              {errors.price && <p className="text-xs text-rose-400 mt-1" role="alert">{errors.price.message}</p>}
            </div>

            <div>
              <label htmlFor="form-stock" className="block text-xs font-medium text-slate-300 mb-1">
                Stock Qty
              </label>
              <input
                id="form-stock"
                type="number"
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register('stock', {
                  valueAsNumber: true,
                  min: { value: 0, message: 'Stock cannot be negative' },
                })}
              />
            </div>
          </div>

          {/* Mileage & Fuel Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="form-mileage" className="block text-xs font-medium text-slate-300 mb-1">
                Mileage (mi) *
              </label>
              <input
                id="form-mileage"
                type="number"
                aria-invalid={!!errors.mileage}
                aria-required="true"
                className={`w-full bg-slate-950 border ${
                  errors.mileage ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800'
                } text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                {...register('mileage', {
                  valueAsNumber: true,
                  required: 'Mileage is required',
                  min: { value: 0, message: 'Mileage cannot be negative' },
                })}
              />
              {errors.mileage && <p className="text-xs text-rose-400 mt-1" role="alert">{errors.mileage.message}</p>}
            </div>

            <div>
              <label htmlFor="form-fuelType" className="block text-xs font-medium text-slate-300 mb-1">
                Fuel Type *
              </label>
              <select
                id="form-fuelType"
                aria-required="true"
                className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                {...register('fuelType', { required: 'Fuel type is required' })}
              >
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Plug-in Hybrid">Plug-in Hybrid</option>
              </select>
            </div>
          </div>

          {/* Transmission */}
          <div>
            <label htmlFor="form-transmission" className="block text-xs font-medium text-slate-300 mb-1">
              Transmission *
            </label>
            <select
              id="form-transmission"
              aria-required="true"
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('transmission', { required: 'Transmission is required' })}
            >
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="CVT">CVT</option>
              <option value="Dual-Clutch">Dual-Clutch</option>
            </select>
          </div>

          {/* Image Upload & URL Input with Live Preview */}
          <div className="space-y-2">
            <label htmlFor="form-image" className="block text-xs font-medium text-slate-300">
              Vehicle Image (URL or File Upload)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="sm:col-span-2 space-y-2">
                <input
                  id="form-image"
                  type="url"
                  placeholder="https://example.com/vehicle-image.jpg"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...register('image')}
                />
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-500">Or upload file:</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    aria-label="Upload vehicle image file"
                    className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-950 file:text-indigo-300 hover:file:bg-indigo-900 cursor-pointer"
                    data-testid="file-upload-input"
                  />
                </div>
              </div>

              {/* Preview Box */}
              <div className="h-20 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Vehicle Preview"
                    className="w-full h-full object-cover"
                    data-testid="image-preview-img"
                  />
                ) : (
                  <span className="text-xs text-slate-600">No Image</span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="form-description" className="block text-xs font-medium text-slate-300 mb-1">
              Description
            </label>
            <textarea
              id="form-description"
              rows={3}
              placeholder="Provide key vehicle details, condition, feature packages..."
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              {...register('description')}
            />
          </div>

          {/* Submit Controls */}
          <div className="flex space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 min-h-[44px]"
              data-testid="form-cancel-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 min-h-[44px] focus:outline-none focus:ring-2 focus:ring-indigo-400"
              data-testid="form-submit-btn"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : initialData ? (
                <span>Update Vehicle</span>
              ) : (
                <span>Create Vehicle</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleFormModal;
