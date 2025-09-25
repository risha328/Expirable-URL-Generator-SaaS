import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    dateOfBirth: '',
    address: '',
    isSubscribed: false,
    subscriptionPlan: 'Free'
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.bio || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || '',
        isSubscribed: user.isSubscribed || false,
        subscriptionPlan: user.subscriptionPlan || 'Free'
      });
      setError('');
    } else {
      setError('User data not available. Please log in again.');
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleDateChange = (e) => {
    setProfile(prev => ({
      ...prev,
      dateOfBirth: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.put('/auth/profile', profile);
      const updatedUser = response.data.user;
      setProfile(updatedUser);
      setUser(updatedUser);
      setIsEditing(false);
      setSuccess(t('profile.updateSuccess'));
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.message || t('profile.updateError'));
    } finally {
      setIsSaving(false);
    }
  };

  const getUserInitials = () => {
    return profile.firstName && profile.lastName
      ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase()
      : 'U';
  };

  const formatDateOfBirth = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Invalid date
    return date.toISOString().split('T')[0];
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('profile.title')}</h1>
          <p className="text-gray-600 mt-2">{t('profile.description')}</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl font-bold">
                {getUserInitials()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-blue-100">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                {isEditing ? t('profile.cancel') : t('profile.edit')}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.personalInfo')}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.firstName')}
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleInputChange}
                      required
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.lastName')}
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleInputChange}
                      required
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.email')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg"
                    />
                    <p className="text-xs text-gray-500 mt-1">{t('profile.emailNote')}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.phone')}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('profile.dateOfBirth')}
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formatDateOfBirth(profile.dateOfBirth)}
                      onChange={handleDateChange}
                      disabled={!isEditing}
                      max={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.address')}</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.addressLabel')}
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    value={profile.address || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'
                    }`}
                    placeholder={t('profile.addressPlaceholder')}
                  />
                </div>
              </div>

              {/* Bio Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.bio')}</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('profile.bioLabel')}
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={profile.bio || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      isEditing ? 'border-gray-300' : 'bg-gray-50 border-gray-200'
                    }`}
                    placeholder={t('profile.bioPlaceholder')}
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {profile.bio?.length || 0}/500 {t('profile.characters')}
                  </p>
                </div>
              </div>

              {/* Subscription Section */}
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('profile.subscription')}</h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {t('profile.currentPlan')}:
                      </p>
                      <p className="text-lg font-semibold text-gray-900 capitalize">
                        {profile.subscriptionPlan}
                      </p>
                      <p className={`text-sm ${profile.isSubscribed ? 'text-green-600' : 'text-gray-500'}`}>
                        {profile.isSubscribed ? t('profile.proActive') : t('profile.freePlan')}
                      </p>
                    </div>
                    {!profile.isSubscribed && (
                      <a
                        href="/pricing"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                      >
                        {t('profile.upgrade')}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset to original data
                      if (user) {
                        setProfile({
                          firstName: user.firstName || '',
                          lastName: user.lastName || '',
                          email: user.email || '',
                          phone: user.phone || '',
                          bio: user.bio || '',
                          dateOfBirth: user.dateOfBirth || '',
                          address: user.address || '',
                          isSubscribed: user.isSubscribed || false,
                          subscriptionPlan: user.subscriptionPlan || 'Free'
                        });
                      }
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    disabled={isSaving}
                  >
                    {t('profile.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isSaving ? t('profile.saving') : t('profile.saveChanges')}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
