'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Briefcase, 
  Upload, 
  Send, 
  Heart,
  CheckCircle,
  Calendar,
  MapPin,
  Loader
} from 'lucide-react';

// Define proper types for form data
interface FormData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  email: string;
  address: string;
  educationalStatus: string;
  institutionName: string;
  fieldOfStudy: string;
  yearOfStudy: string;
  currentOccupation: string;
  relevantSkills: string;
  languagesKnown: string;
  certifications: string;
  engagementType: string;
  areaOfInterest: string;
  preferredStartDate: string;
  availability: string;
  duration: string;
  motivation: string;
  previousExperience: string;
  howDidYouHear: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  relationship: string;
  termsConsent: boolean;
  photoConsent: boolean;
  resume: File | null;
}

interface SubmitStatus {
  type: 'success' | 'error' | null;
  message: string;
}

interface ApiResponse {
  message?: string;
}

const GetInvolved = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    contactNumber: '',
    email: '',
    address: '',
    educationalStatus: '',
    institutionName: '',
    fieldOfStudy: '',
    yearOfStudy: '',
    currentOccupation: '',
    relevantSkills: '',
    languagesKnown: '',
    certifications: '',
    engagementType: '',
    areaOfInterest: '',
    preferredStartDate: '',
    availability: '',
    duration: '',
    motivation: '',
    previousExperience: '',
    howDidYouHear: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    relationship: '',
    termsConsent: false,
    photoConsent: false,
    resume: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: null,
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const { name, type } = target;
    
    let value: string | boolean | File | null;
    
    if (type === 'checkbox') {
      const checkbox = target as HTMLInputElement;
      value = checkbox.checked;
    } else if (type === 'file') {
      const fileInput = target as HTMLInputElement;
      value = fileInput.files ? fileInput.files[0] : null;
    } else {
      value = target.value;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });
    
    try {
      // Create form data for submission
      const submitData = new FormData();
      
      // Properly handle each form field
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'resume' && value instanceof File) {
          submitData.append(key, value);
        } else if (typeof value === 'boolean') {
          submitData.append(key, value.toString());
        } else if (value !== null) {
          submitData.append(key, String(value));
        }
      });

      const response = await fetch('/api/submit-application', {
        method: 'POST',
        body: submitData,
      });

      const result: ApiResponse = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Application submitted successfully! We will get back to you within 3-5 business days.'
        });
        // Reset form
        setFormData({
          fullName: '',
          dateOfBirth: '',
          gender: '',
          contactNumber: '',
          email: '',
          address: '',
          educationalStatus: '',
          institutionName: '',
          fieldOfStudy: '',
          yearOfStudy: '',
          currentOccupation: '',
          relevantSkills: '',
          languagesKnown: '',
          certifications: '',
          engagementType: '',
          areaOfInterest: '',
          preferredStartDate: '',
          availability: '',
          duration: '',
          motivation: '',
          previousExperience: '',
          howDidYouHear: '',
          emergencyContactName: '',
          emergencyContactPhone: '',
          relationship: '',
          termsConsent: false,
          photoConsent: false,
          resume: null
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Failed to submit application. Please try again.'
        });
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Network error. Please check your connection and try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="py-40 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 text-white relative overflow-hidden"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.3)), url('/images/JoinUs.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Get Involved
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Join our mission to create lasting change through volunteering, internships, 
              and ethical practices that transform communities worldwide.
            </p>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            x: [-20, 20, -20],
            y: [-30, 30, -30],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-16 h-16 bg-white/10 rounded-full blur-sm"
        />
        <motion.div
          animate={{ 
            x: [30, -30, 30],
            y: [20, -20, 20],
            rotate: [360, 180, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-24 h-24 bg-green-400/20 rounded-full blur-sm"
        />
      </section>

      {/* Ethics and Compliance Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Ethics and Compliance
              </h2>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-lg leading-relaxed mb-6">
                  Jagatmitra Foundation operates under a strict code of ethics to ensure that all activities 
                  are conducted with integrity, transparency, and accountability. Our governance framework 
                  aligns with applicable national laws, international standards, and the United Nations 
                  Sustainable Development Goals (SDGs).
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                  >
                    <h4 className="font-semibold text-gray-900 mb-3">We have established internal policies and procedures to:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Ensure transparent financial management</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Prevent fraud, corruption, and misuse of resources</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Promote diversity, equity, and inclusion in all programs</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Safeguard the rights and dignity of all beneficiaries and stakeholders</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Maintain clear reporting and grievance redressal mechanisms</span>
                      </li>
                    </ul>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-purple-500 to-blue-600 text-white p-6 rounded-xl shadow-lg"
                  >
                    <h4 className="font-semibold mb-4">Our Commitment</h4>
                    <p className="text-purple-100">
                      All trustees, employees, volunteers, and partners are expected to comply with our 
                      ethical guidelines and legal obligations. We review our compliance processes regularly 
                      to strengthen governance, protect public trust, and ensure that every action contributes 
                      to our mission of sustainable and inclusive development.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Volunteer/Internship Opportunities */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Whether you&apos;re looking to volunteer your time or gain valuable experience through an internship, 
              we offer meaningful opportunities to make a real difference in communities around the world.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Volunteer Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-green-100 h-full">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Volunteer With Us</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-lg blur-xl"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-green-200">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Join our community of passionate volunteers who dedicate their time and skills to create positive change. 
                        From field work to digital campaigns, There&apos;s a place for everyone in our mission.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-green-500" />
                          <span>Flexible Timing</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span>Remote & Field</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-green-500" />
                          <span>Community Impact</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Certificate</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Areas You Can Contribute:</h4>
                    <ul className="text-sm space-y-1 text-green-100">
                      <li>• Education & Child Welfare</li>
                      <li>• Women Empowerment Programs</li>
                      <li>• Environmental Conservation</li>
                      <li>• Community Development</li>
                      <li>• Digital Marketing & Social Media</li>
                      <li>• Event Management & Fundraising</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Internship Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-blue-100 h-full">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Internship Program</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg blur-xl"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-blue-200">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Gain hands-on experience in the non-profit sector while contributing to meaningful projects. 
                        Our structured internship program offers mentorship, skill development, and real-world impact.                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>1-6 Months</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span>Mentorship</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                          <span>Completion Certificate</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Briefcase className="w-4 h-4 text-blue-500" />
                          <span>Portfolio Building</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Internship Domains:</h4>
                    <ul className="text-sm space-y-1 text-blue-100">
                      <li>• Program Management & Implementation</li>
                      <li>• Research & Policy Analysis</li>
                      <li>• Communications & Content Creation</li>
                      <li>• Finance & Grant Writing</li>
                      <li>• Human Resources & Administration</li>
                      <li>• Technology & Data Analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Application Form
              </h2>
              <p className="text-xl text-gray-600">
                Ready to make a difference? Fill out the form below to apply for volunteer or internship opportunities.
              </p>
            </div>

            {/* Status Messages */}
            {submitStatus.type && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-8 p-4 rounded-lg border ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <div className="flex items-center">
                  <CheckCircle className={`w-5 h-5 mr-2 ${
                    submitStatus.type === 'success' ? 'text-green-500' : 'text-red-500'
                  }`} />
                  {submitStatus.message}
                </div>
              </motion.div>
            )}

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    Personal Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth / Age *</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number *</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Residential Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="City, State, Country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Education & Background */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    Education & Background
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Educational Status *</label>
                      <select
                        name="educationalStatus"
                        value={formData.educationalStatus}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Status</option>
                        <option value="School Student">School Student</option>
                        <option value="College Student">College Student</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Post Graduate">Post Graduate</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
                      <input
                        type="text"
                        name="institutionName"
                        value={formData.institutionName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study / Major</label>
                      <input
                        type="text"
                        name="fieldOfStudy"
                        value={formData.fieldOfStudy}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study / Graduation Year</label>
                      <input
                        type="text"
                        name="yearOfStudy"
                        value={formData.yearOfStudy}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    Professional / Skills Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Occupation</label>
                      <input
                        type="text"
                        name="currentOccupation"
                        value={formData.currentOccupation}
                        onChange={handleInputChange}
                        placeholder="Student, Working Professional, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Languages Known</label>
                      <input
                        type="text"
                        name="languagesKnown"
                        value={formData.languagesKnown}
                        onChange={handleInputChange}
                        placeholder="Hindi, English, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relevant Skills</label>
                      <textarea
                        name="relevantSkills"
                        value={formData.relevantSkills}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="Teaching, writing, graphic design, event management, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Certifications or Training</label>
                      <textarea
                        name="certifications"
                        value={formData.certifications}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="If relevant"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Volunteering Preferences */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">4</span>
                    </div>
                    Volunteering / Internship Preferences
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type of Engagement *</label>
                      <select
                        name="engagementType"
                        value={formData.engagementType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Type</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Internship">Internship</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Area of Interest *</label>
                      <select
                        name="areaOfInterest"
                        value={formData.areaOfInterest}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Area</option>
                        <option value="Education">Education</option>
                        <option value="Women Empowerment">Women Empowerment</option>
                        <option value="Environment">Environment</option>
                        <option value="Fundraising">Fundraising</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Event Support">Event Support</option>
                        <option value="Field Work">Field Work</option>
                        <option value="Administration">Administration</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Start Date</label>
                      <input
                        type="date"
                        name="preferredStartDate"
                        value={formData.preferredStartDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                      <input
                        type="text"
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        placeholder="Weekdays / Weekends, Hours per week"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="Short-term, Long-term, Specific months"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Motivation & Experience */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">5</span>
                    </div>
                    Motivation & Experience
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to volunteer/intern with us? *</label>
                      <textarea
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Previous Volunteer or Internship Experience</label>
                      <textarea
                        name="previousExperience"
                        value={formData.previousExperience}
                        onChange={handleInputChange}
                        rows={3}
                        placeholder="If any"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">How did you hear about us?</label>
                      <select
                        name="howDidYouHear"
                        value={formData.howDidYouHear}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Option</option>
                        <option value="Website">Website</option>
                        <option value="Friend">Friend</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Event">Event</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Emergency & Legal */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">6</span>
                    </div>
                    Emergency & Legal
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name *</label>
                      <input
                        type="text"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone *</label>
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={formData.emergencyContactPhone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relationship to Applicant *</label>
                      <input
                        type="text"
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Resume/CV Upload</label>
                      <div className="flex items-center space-x-3">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <input
                          type="file"
                          name="resume"
                          onChange={handleInputChange}
                          accept=".pdf,.doc,.docx"
                          className="text-sm text-gray-600"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        name="termsConsent"
                        checked={formData.termsConsent}
                        onChange={handleInputChange}
                        required
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="text-sm text-gray-700">
                        I consent to the Terms & Conditions and agree to comply with Jagatmitra Foundation&apos;s policies and guidelines. *
                      </label>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        name="photoConsent"
                        checked={formData.photoConsent}
                        onChange={handleInputChange}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label className="text-sm text-gray-700">
                        I consent to the use of my photos/videos for promotional purposes (optional)
                      </label>
                    </div>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-center"
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl text-lg font-semibold shadow-lg flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Application
                      </>
                    )}
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Founder's Message */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Founder&apos;s Message
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto"></div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <blockquote className="text-xl md:text-2xl font-medium mb-8 italic text-blue-100">
                &quot;Service to humanity and nature is the purest form of devotion.&quot;
              </blockquote>
              
              <div className="prose prose-lg prose-blue max-w-none text-gray-200 text-left">
                <p className="mb-6">
                  When we founded Jagatmitra Foundation in 2020, the world was facing an unprecedented crisis — a global pandemic that exposed the fragility of systems and the strength of compassion. Amidst uncertainty, we saw one clear truth: change begins with empathy, action, and a shared vision for a better world.
                </p>
                
                <p className="mb-6">
                  Jagatmitra, meaning &quot;Friend of the World&quot;, was born out of this deep-rooted belief — that each of us holds the power to uplift, protect, and transform the lives of those around us. Whether it&apos;s the smile of a child gaining access to education, a tree planted in parched soil, an elderly person receiving dignity in their final years, or a woman reclaiming her voice — these are not just programs; they are stories of resilience, hope, and collective humanity.
                </p>
                
                <p className="mb-6">
                  Over the years, with the unwavering support of our team, volunteers, partners, and well-wishers, we&apos;ve built more than an organization — we&apos;ve built a movement. One that aligns grassroots action with global goals. One that believes that inclusivity, dignity, and sustainability are not privileges but rights.
                </p>
                
                <p className="mb-6">
                  Our registrations with the Government of India, United Nations platforms, and our eligibility to undertake CSR collaborations stand as testaments to our credibility and readiness to scale impact — but our true strength lies in the communities we serve and the trust they place in us.
                </p>
                
                <p className="mb-6">
                  As we move forward, we invite you — individuals, corporates, institutions — to join hands with us. Let&apos;s build a world where no child is left behind, no woman silenced, no elder forgotten, and no tree chopped in ignorance. Let&apos;s be Jagatmitras — friends to the world, custodians of a kinder tomorrow.
                </p>
                
                <div className="text-center mt-8">
                  <p className="text-lg font-semibold text-yellow-300">With gratitude and hope,</p>
                  <p className="text-xl font-bold text-white mt-2">Founder & Director</p>
                  <p className="text-lg text-blue-200">Jagatmitra Foundation</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Background decorative elements */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-32 h-32 border border-white/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 left-10 w-24 h-24 border border-white/10 rounded-full"
        />
      </section>
    </main>
  );
};

export default GetInvolved;

