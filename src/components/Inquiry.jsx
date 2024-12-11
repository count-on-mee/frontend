import React, { useState, useEffect } from 'react';

const Inquiry = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    dataConsent: false,
    marketing: false,
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validators = {
    name: value => value.trim().length >= 2,
    email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: value => value.trim().length >= 10,
  };

  const validateField = (name, value) => {
    if (validators[name]) {
      return validators[name](value);
    }
    return true;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    let newErrors = {};
    let hasErrors = false;

    Object.keys(validators).forEach(field => {
      if (!validateField(field, formData[field])) {
        newErrors[field] = true;
        hasErrors = true;
      }
    });

    if (!formData.dataConsent) {
      newErrors.dataConsent = true;
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      console.log('Form data:', formData);
      setShowSuccess(true);
      setFormData({
        name: '',
        email: '',
        message: '',
        dataConsent: false,
        marketing: false,
      });
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      const newErrors = {};
      Object.keys(validators).forEach(field => {
        if (formData[field] && !validateField(field, formData[field])) {
          newErrors[field] = true;
        }
      });
      setErrors(newErrors);
    }, 300);

    return () => clearTimeout(debounce);
  }, [formData]);

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        {showSuccess && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
            Thank you! Your form has been submitted successfully.
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6 text-gray-900">Contact Form</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.name ? 'border-red-500' : ''
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                Name must be at least 2 characters long.
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.email ? 'border-red-500' : ''
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                Invalid email address.
              </p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.message ? 'border-red-500' : ''
              }`}
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">
                Message must be at least 10 characters long.
              </p>
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="dataConsent"
                checked={formData.dataConsent}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                I consent to data processing.
              </label>
            </div>
            {errors.dataConsent && (
              <p className="text-red-500 text-sm mt-1">
                You must consent to data processing.
              </p>
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="marketing"
                checked={formData.marketing}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-900">
                I want to receive marketing emails.
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Inquiry;
