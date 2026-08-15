import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiEdit3, FiSave, FiCamera, FiUser, FiMail, FiPhone, FiCheck, FiLoader } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getUserById, updateUser, updateProfilePicture } from '../services/UserService';

const UserProfile = ({ isOpen, onClose }) => {
    const { user, updateUser: updateAuthUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [saving, setSaving] = useState(false);
    const [uploadingPic, setUploadingPic] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const fileInputRef = useRef(null);
    const panelRef = useRef(null);

    useEffect(() => {
        if (isOpen && user?.id) {
            fetchProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, user?.id]);

    const fetchProfile = async () => {
        try {
            const res = await getUserById(user.id);
            setProfileData(res.data);
            setEditForm({
                fullName: res.data.fullName || '',
                email: res.data.email || '',
                phone: res.data.phone || '',
            });
        } catch (err) {
            console.error('Failed to fetch profile', err);
        }
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await updateUser(user.id, editForm);
            setProfileData(res.data);
            updateAuthUser(res.data);
            setIsEditing(false);
            showSuccess('Profile updated successfully!');
        } catch (err) {
            console.error('Failed to update profile', err);
        } finally {
            setSaving(false);
        }
    };

    const handlePictureClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            return; // Max 5MB
        }

        setUploadingPic(true);
        try {
            const base64 = await fileToBase64(file);
            const res = await updateProfilePicture(user.id, base64);
            setProfileData(res.data);
            updateAuthUser(res.data);
            showSuccess('Profile picture updated!');
        } catch (err) {
            console.error('Failed to upload picture', err);
        } finally {
            setUploadingPic(false);
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const showSuccess = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(''), 3000);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditForm({
            fullName: profileData?.fullName || '',
            email: profileData?.email || '',
            phone: profileData?.phone || '',
        });
    };

    const getInitials = () => {
        const name = profileData?.fullName || profileData?.username || 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="profile-overlay" onClick={handleOverlayClick}>
            <div className="profile-panel" ref={panelRef}>
                {/* Header */}
                <div className="profile-panel-header">
                    <div>
                        <span className="profile-panel-label">User Profile</span>
                        <h2 className="profile-panel-title">Identity Node</h2>
                    </div>
                    <button className="profile-close-btn" onClick={onClose} id="profile-close-btn">
                        <FiX />
                    </button>
                </div>

                {/* Avatar Section */}
                <div className="profile-avatar-section">
                    <div className="profile-avatar-wrapper" onClick={handlePictureClick}>
                        {profileData?.profilePicture ? (
                            <img
                                src={profileData.profilePicture}
                                alt="Profile"
                                className="profile-avatar-img"
                            />
                        ) : (
                            <div className="profile-avatar-initials">
                                {getInitials()}
                            </div>
                        )}
                        <div className="profile-avatar-overlay">
                            {uploadingPic ? (
                                <FiLoader className="spin-icon" />
                            ) : (
                                <FiCamera />
                            )}
                        </div>
                        <div className="profile-avatar-ring" />
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="profile-picture-input"
                    />
                    <h3 className="profile-display-name">
                        {profileData?.fullName || profileData?.username || 'User'}
                    </h3>
                    <span className="profile-display-username">@{profileData?.username}</span>
                </div>

                {/* Success Message */}
                {successMsg && (
                    <div className="profile-success-pill">
                        <FiCheck /> {successMsg}
                    </div>
                )}

                {/* Details Section */}
                <div className="profile-details-section">
                    <div className="profile-section-header">
                        <span className="profile-section-label">Account Details</span>
                        {!isEditing ? (
                            <button
                                className="profile-edit-btn"
                                onClick={() => setIsEditing(true)}
                                id="profile-edit-btn"
                            >
                                <FiEdit3 /> Edit
                            </button>
                        ) : (
                            <div className="profile-edit-actions">
                                <button
                                    className="profile-save-btn"
                                    onClick={handleSave}
                                    disabled={saving}
                                    id="profile-save-btn"
                                >
                                    {saving ? <FiLoader className="spin-icon" /> : <FiSave />}
                                    {saving ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    className="profile-cancel-btn"
                                    onClick={handleCancel}
                                    id="profile-cancel-btn"
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="profile-fields">
                        {/* Full Name */}
                        <div className="profile-field">
                            <div className="profile-field-icon">
                                <FiUser />
                            </div>
                            <div className="profile-field-content">
                                <label className="profile-field-label">Full Name</label>
                                {isEditing ? (
                                    <input
                                        name="fullName"
                                        className="profile-field-input"
                                        value={editForm.fullName}
                                        onChange={handleEditChange}
                                        placeholder="Enter your full name"
                                        id="profile-fullname-input"
                                    />
                                ) : (
                                    <span className="profile-field-value">
                                        {profileData?.fullName || <em className="text-dim">Not set</em>}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Username */}
                        <div className="profile-field">
                            <div className="profile-field-icon accent">
                                <FiUser />
                            </div>
                            <div className="profile-field-content">
                                <label className="profile-field-label">Username</label>
                                <span className="profile-field-value">
                                    {profileData?.username}
                                    <span className="profile-field-badge">Immutable</span>
                                </span>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="profile-field">
                            <div className="profile-field-icon">
                                <FiMail />
                            </div>
                            <div className="profile-field-content">
                                <label className="profile-field-label">Email</label>
                                {isEditing ? (
                                    <input
                                        name="email"
                                        type="email"
                                        className="profile-field-input"
                                        value={editForm.email}
                                        onChange={handleEditChange}
                                        placeholder="Enter your email"
                                        id="profile-email-input"
                                    />
                                ) : (
                                    <span className="profile-field-value">
                                        {profileData?.email}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="profile-field">
                            <div className="profile-field-icon">
                                <FiPhone />
                            </div>
                            <div className="profile-field-content">
                                <label className="profile-field-label">Phone</label>
                                {isEditing ? (
                                    <input
                                        name="phone"
                                        className="profile-field-input"
                                        value={editForm.phone}
                                        onChange={handleEditChange}
                                        placeholder="Enter your phone number"
                                        id="profile-phone-input"
                                    />
                                ) : (
                                    <span className="profile-field-value">
                                        {profileData?.phone || <em className="text-dim">Not set</em>}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="profile-panel-footer">
                    <span className="tiny text-dim">User ID: {profileData?.id}</span>
                    <span className="tiny text-dim">System Encrypted · AES-256</span>
                </div>
            </div>

            <style>{`
                .profile-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(8px);
                    z-index: 1000;
                    display: flex;
                    justify-content: flex-end;
                    animation: overlayFadeIn 0.3s ease;
                }

                @keyframes overlayFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .profile-panel {
                    width: 420px;
                    max-width: 90vw;
                    height: 100vh;
                    background: rgba(22, 24, 21, 0.95);
                    backdrop-filter: blur(40px);
                    border-left: 1px solid rgba(255, 255, 255, 0.06);
                    display: flex;
                    flex-direction: column;
                    animation: panelSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    overflow-y: auto;
                }

                @keyframes panelSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .profile-panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 2rem 2rem 1rem;
                }

                .profile-panel-label {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: var(--accent-primary);
                    font-weight: 600;
                }

                .profile-panel-title {
                    font-size: 1.5rem;
                    font-weight: 700;
                    letter-spacing: -0.03em;
                    margin: 0.25rem 0 0;
                    color: white;
                }

                .profile-close-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border-subtle);
                    color: var(--text-dim);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 1.1rem;
                }

                .profile-close-btn:hover {
                    color: white;
                    background: rgba(255, 255, 255, 0.1);
                    transform: rotate(90deg);
                }

                /* Avatar Section */
                .profile-avatar-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1.5rem 2rem 2rem;
                    gap: 0.75rem;
                }

                .profile-avatar-wrapper {
                    position: relative;
                    width: 110px;
                    height: 110px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }

                .profile-avatar-wrapper:hover {
                    transform: scale(1.05);
                }

                .profile-avatar-wrapper:hover .profile-avatar-overlay {
                    opacity: 1;
                }

                .profile-avatar-img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }

                .profile-avatar-initials {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--accent-secondary), #7b5ea7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.2rem;
                    font-weight: 700;
                    color: white;
                    letter-spacing: 0.05em;
                }

                .profile-avatar-overlay {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.55);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    font-size: 1.5rem;
                    color: white;
                }

                .profile-avatar-ring {
                    position: absolute;
                    inset: -4px;
                    border-radius: 50%;
                    border: 2px solid var(--accent-primary);
                    opacity: 0.4;
                    pointer-events: none;
                    animation: ringPulse 3s infinite ease-in-out;
                }

                @keyframes ringPulse {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.03); }
                }

                .profile-display-name {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: white;
                    margin: 0;
                    letter-spacing: -0.02em;
                }

                .profile-display-username {
                    font-size: 0.85rem;
                    color: var(--text-dim);
                    font-weight: 500;
                }

                /* Success Pill */
                .profile-success-pill {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin: 0 2rem;
                    padding: 0.65rem 1rem;
                    border-radius: 12px;
                    background: rgba(159, 220, 86, 0.1);
                    color: var(--accent-primary);
                    font-size: 0.8rem;
                    font-weight: 600;
                    border: 1px solid rgba(159, 220, 86, 0.2);
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-8px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Details Section */
                .profile-details-section {
                    flex: 1;
                    padding: 0 2rem;
                    margin-top: 0.5rem;
                }

                .profile-section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.25rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid var(--border-subtle);
                }

                .profile-section-label {
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--text-dim);
                    font-weight: 600;
                }

                .profile-edit-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    background: rgba(159, 220, 86, 0.1);
                    border: 1px solid rgba(159, 220, 86, 0.2);
                    color: var(--accent-primary);
                    padding: 0.4rem 0.85rem;
                    border-radius: 999px;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }

                .profile-edit-btn:hover {
                    background: rgba(159, 220, 86, 0.2);
                    transform: translateY(-1px);
                }

                .profile-edit-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .profile-save-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    background: var(--accent-primary);
                    border: none;
                    color: var(--text-dark);
                    padding: 0.4rem 0.85rem;
                    border-radius: 999px;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }

                .profile-save-btn:hover {
                    box-shadow: 0 0 12px rgba(159, 220, 86, 0.3);
                    transform: translateY(-1px);
                }

                .profile-save-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .profile-cancel-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid var(--border-subtle);
                    color: var(--text-dim);
                    padding: 0.4rem 0.85rem;
                    border-radius: 999px;
                    font-size: 0.78rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }

                .profile-cancel-btn:hover {
                    color: white;
                    background: rgba(255, 255, 255, 0.1);
                }

                /* Fields */
                .profile-fields {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .profile-field {
                    display: flex;
                    align-items: flex-start;
                    gap: 1rem;
                    padding: 1rem;
                    border-radius: 16px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    transition: all 0.2s ease;
                }

                .profile-field:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(255, 255, 255, 0.08);
                }

                .profile-field-icon {
                    width: 38px;
                    height: 38px;
                    min-width: 38px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--text-dim);
                    font-size: 1rem;
                    margin-top: 2px;
                }

                .profile-field-icon.accent {
                    background: rgba(159, 220, 86, 0.1);
                    color: var(--accent-primary);
                }

                .profile-field-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                    min-width: 0;
                }

                .profile-field-label {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    color: var(--text-dim);
                    font-weight: 600;
                }

                .profile-field-value {
                    font-size: 0.95rem;
                    color: white;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .profile-field-badge {
                    font-size: 0.6rem;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    color: var(--accent-secondary);
                    background: rgba(84, 95, 255, 0.1);
                    padding: 0.2rem 0.5rem;
                    border-radius: 999px;
                    font-weight: 600;
                }

                .profile-field-input {
                    background: rgba(255, 255, 255, 0.05) !important;
                    border: 1px solid rgba(159, 220, 86, 0.2) !important;
                    border-radius: 10px !important;
                    padding: 0.6rem 0.85rem !important;
                    color: white !important;
                    font-size: 0.9rem !important;
                    font-family: inherit;
                    width: 100% !important;
                    transition: all 0.2s ease;
                }

                .profile-field-input:focus {
                    border-color: var(--accent-primary) !important;
                    background: rgba(159, 220, 86, 0.08) !important;
                    outline: none !important;
                    box-shadow: 0 0 0 3px rgba(159, 220, 86, 0.1);
                }

                /* Footer */
                .profile-panel-footer {
                    padding: 1.25rem 2rem;
                    display: flex;
                    justify-content: space-between;
                    border-top: 1px solid var(--border-subtle);
                    margin-top: auto;
                }

                /* Spinner */
                .spin-icon {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                /* Mobile */
                @media (max-width: 480px) {
                    .profile-panel {
                        width: 100vw;
                    }
                }
            `}</style>
        </div>
    );
};

export default UserProfile;
