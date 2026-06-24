/* src/components/DonatePage.tsx */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Upload, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Camera,
  CheckCircle,
  AlertCircle,
  Send
} from 'lucide-react';

const DonatePage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    identityType: 'aadhar',
    identityNumber: '',
    donationType: '',
    description: '',
    pickupRequired: false,
    preferredDate: '',
    preferredTime: ''
  });

  const [files, setFiles] = useState({
    identityProof: null as File | null,
    donationImages: [] as File[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const donationCategories = [
    'Clothes & Textiles',
    'Books & Educational Materials',
    'Electronic Items',
    'Furniture & Household Items',
    'Toys & Games',
    'Sports Equipment',
    'Medical Equipment',
    'Food & Groceries',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: selectedFiles } = e.target;
    if (!selectedFiles) return;

    if (name === 'identityProof') {
      setFiles(prev => ({ ...prev, identityProof: selectedFiles[0] }));
    } else if (name === 'donationImages') {
      // Limit to 5 images
      const imageArray = Array.from(selectedFiles).slice(0, 5);
      setFiles(prev => ({ ...prev, donationImages: imageArray }));
    }
  };

  const validateForm = () => {
    const requiredFields = [
      'name', 'email', 'phone', 'address', 
      'identityNumber', 'donationType', 'description'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      setSubmitMessage(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setSubmitStatus('error');
      return false;
    }

    if (!files.identityProof) {
      setSubmitMessage('Please upload your identity proof document');
      setSubmitStatus('error');
      return false;
    }

    if (files.donationImages.length === 0) {
      setSubmitMessage('Please upload at least one image of your donation');
      setSubmitStatus('error');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSubmitMessage('Please enter a valid email address');
      setSubmitStatus('error');
      return false;
    }

    // Validate phone number (basic Indian phone number validation)
    const phoneRegex = /^[+]?[0-9]{10,13}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setSubmitMessage('Please enter a valid phone number');
      setSubmitStatus('error');
      return false;
    }

    if (formData.pickupRequired && (!formData.preferredDate || !formData.preferredTime)) {
      setSubmitMessage('Please select preferred date and time for pickup');
      setSubmitStatus('error');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    // Reset previous status
    setSubmitStatus('idle');
    setSubmitMessage('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      // Add files
      if (files.identityProof) {
        formDataToSend.append('identityProof', files.identityProof);
      }
      
      files.donationImages.forEach((file, index) => {
        formDataToSend.append(`donationImage${index}`, file);
      });

      // Send to API
      const response = await fetch('/api/donate', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          identityType: 'aadhar',
          identityNumber: '',
          donationType: '',
          description: '',
          pickupRequired: false,
          preferredDate: '',
          preferredTime: ''
        });
        
        setFiles({
          identityProof: null,
          donationImages: []
        });

        // Reset file inputs
        const identityInput = document.getElementById('identity-upload') as HTMLInputElement;
        const imagesInput = document.getElementById('images-upload') as HTMLInputElement;
        if (identityInput) identityInput.value = '';
        if (imagesInput) imagesInput.value = '';

      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || 'Failed to submit donation request');
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setSubmitMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-300 rounded-full blur-3xl" />
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo with Image Support */}
            <Link href="/" className="block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center space-x-3 cursor-pointer"
              >
                {/* Logo Image Container */}
                <div className="w-20 h-20 transparent-standout group-hover:shadow-lg transition-shadow duration-300">
                  <Image 
                    src="/images/jagatmitra-logo.png" 
                    alt="Jagatmitra Foundation Logo"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to Heart icon if logo image fails
                      const fallbackDiv = document.createElement('div');
                      fallbackDiv.className = 'w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center';
                      fallbackDiv.innerHTML = `
                        <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      `;
                      e.currentTarget.parentElement?.replaceChild(fallbackDiv, e.currentTarget);
                    }}
                  />
                </div>
              </motion.div>
            </Link>
            <br></br>
            <h1 className="text-5xl font-bold mb-4">Donate with Love</h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Your unused items can bring joy to someone else. Every donation makes a difference in building stronger communities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Form Header */}
            <div className="bg-gradient-to-r from-green-500 to-blue-500 p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Donation Form</h2>
              <p className="text-green-100">Fill in your details and tell us about your donation</p>
            </div>

            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-green-50 border-l-4 border-green-500 flex items-start"
              >
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-800">Success!</h3>
                  <p className="text-green-600">{submitMessage}</p>
                  <p className="text-green-600 text-sm mt-1">A confirmation email has been sent to your email address.</p>
                </div>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-red-50 border-l-4 border-red-500 flex items-start"
              >
                <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-800">Error</h3>
                  <p className="text-red-600">{submitMessage}</p>
                </div>
              </motion.div>
            )}

            {/* Form */}
            <div className="p-8 space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <User className="w-6 h-6 mr-2 text-green-600" />
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Identity Proof Type *
                    </label>
                    <select
                      name="identityType"
                      value={formData.identityType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      required
                    >
                      <option value="aadhar">Aadhar Card</option>
                      <option value="pan">PAN Card</option>
                      <option value="driving_license">Driving License</option>
                      <option value="passport">Passport</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Identity Number *
                    </label>
                    <input
                      type="text"
                      name="identityNumber"
                      value={formData.identityNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      placeholder="Enter your identity number"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complete Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Enter your complete address with pincode"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Donation Details */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Heart className="w-6 h-6 mr-2 text-green-600" />
                  Donation Details
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type of Donation *
                    </label>
                    <select
                      name="donationType"
                      value={formData.donationType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                      required
                    >
                      <option value="">Select donation category</option>
                      {donationCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Please describe your donation items in detail (condition, quantity, brand, etc.)"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Upload className="w-6 h-6 mr-2 text-green-600" />
                  File Uploads
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Identity Proof Document *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <input
                        type="file"
                        name="identityProof"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="hidden"
                        id="identity-upload"
                        required
                      />
                      <label
                        htmlFor="identity-upload"
                        className="cursor-pointer text-sm text-gray-600 hover:text-green-600"
                      >
                        {files.identityProof ? (
                          <span className="text-green-600 font-medium">
                            {files.identityProof.name}
                          </span>
                        ) : (
                          <>
                            <span className="font-medium">Click to upload</span> identity proof
                            <br />
                            <span className="text-xs">JPG, PNG, PDF up to 5MB</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Donation Images * (Max 5)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                      <Camera className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <input
                        type="file"
                        name="donationImages"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png"
                        multiple
                        className="hidden"
                        id="images-upload"
                        required
                      />
                      <label
                        htmlFor="images-upload"
                        className="cursor-pointer text-sm text-gray-600 hover:text-green-600"
                      >
                        {files.donationImages.length > 0 ? (
                          <span className="text-green-600 font-medium">
                            {files.donationImages.length} image(s) selected
                          </span>
                        ) : (
                          <>
                            <span className="font-medium">Click to upload</span> donation photos
                            <br />
                            <span className="text-xs">JPG, PNG up to 5MB each</span>
                          </>
                        )}
                      </label>
                    </div>
                    {files.donationImages.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        Selected files: {files.donationImages.map(f => f.name).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pickup Options */}
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-green-600" />
                  Pickup Arrangement
                </h3>

                <div className="space-y-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="pickupRequired"
                      checked={formData.pickupRequired}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-gray-700">I need pickup service for my donation</span>
                  </label>

                  {formData.pickupRequired && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Date *
                        </label>
                        <input
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleInputChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required={formData.pickupRequired}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Time *
                        </label>
                        <select
                          name="preferredTime"
                          value={formData.preferredTime}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required={formData.pickupRequired}
                        >
                          <option value="">Select time slot</option>
                          <option value="morning">Morning (9 AM - 12 PM)</option>
                          <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                          <option value="evening">Evening (4 PM - 7 PM)</option>
                        </select>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="pt-6"
              >
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Donation Request</span>
                    </>
                  )}
                </button>
              </motion.div>

              {/* Form Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">📝 Form Guidelines</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• All fields marked with * are required</li>
                  <li>• Identity proof helps us verify donations for transparency</li>
                  <li>• Upload clear photos of items you want to donate</li>
                  <li>• Pickup service is available within city limits</li>
                  <li>• You&apos;ll receive a confirmation email after submission</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Need Help?</h3>
            <p className="text-gray-600 mb-6">
              Have questions about your donation? Our team is here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">011-45653583</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">support@jagatmitrafoundation.com</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DonatePage;

