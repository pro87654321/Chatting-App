// This file was previously UserProfile.jsx
import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faTimes, faSpinner, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

// It receives the initial user data and the close handler as props
function UserProfileModal({ user: initialUser, onClose }) {
    const [user, setUser] = useState(initialUser);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

    const handleSave = async (updatedUser) => {
        try {
            
            const res = await axios.put(`http://localhost:8080/api/auth/users/${updatedUser.id}`, updatedUser);
            setUser(res.data); 
            
            setIsPopupOpen(false);
        } catch (err) {
            console.error("Error updating user profile:", err);
            alert("Failed to save profile. Please try again.");
        }
    };

    return (
        // Modal container
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all">
                <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                    <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-20">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-6">
                                <img
                                    src={user.profilePic || `https://ui-avatars.com/api/auth/?name=${user.userName}&background=random`} // FIXED
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-200"
                                />
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">{user.userName}</h1> {/* FIXED */}
                                    <p className="text-md text-gray-500">{user.phone}</p> {/* FIXED */}
                                </div>
                            </div>
                             <button 
                                onClick={() => setIsPopupOpen(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                    
                    <div className={`transition-all duration-500 ease-in-out ${isDetailsExpanded ? 'max-h-screen' : 'max-h-0'} overflow-hidden`}>
                        <div className="p-6 border-t">
                            <h3 className="text-xl font-bold text-gray-700 mb-4">Groups Created</h3>
                            {/* Assuming createdGroups is correct. If not, adjust here. */}
                            {user.createdGroups && user.createdGroups.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {user.createdGroups.map(group => (
                                        <div key={group.id} className="bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-full text-sm">
                                            {group.name} {/* Assuming group objects have a 'name' property */}
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-gray-500">No groups created yet.</p>}
                        </div>

                        <div className="p-6 border-t">
                            <h3 className="text-xl font-bold text-gray-700 mb-4">Groups Joined</h3>
                            {/* FIXED */}
                            {user.groupMemberships && user.groupMemberships.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {user.groupMemberships.map(membership => (
                                        <div key={membership.group.id} className="bg-green-100 text-green-800 font-semibold px-4 py-2 rounded-full text-sm">
                                            {membership.group.name} {/* Adjust if structure is different */}
                                        </div>
                                    ))}
                                </div>
                            ) : <p className="text-gray-500">You haven't joined any groups.</p>}
                        </div>
                    </div>
                    
                    <div className="border-t bg-gray-50 text-center">
                        <button 
                            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                            className="w-full py-3 text-sm font-semibold text-blue-600 hover:bg-gray-100 flex items-center justify-center"
                        >
                            <span>{isDetailsExpanded ? 'Hide Details' : 'View Full Details'}</span>
                            <FontAwesomeIcon icon={isDetailsExpanded ? faChevronUp : faChevronDown} className="ml-2"/>
                        </button>
                    </div>
                </div>
            </div>

            {isPopupOpen && (
                <ProfilePopup user={user} onClose={() => setIsPopupOpen(false)} onSave={handleSave} />
            )}
        </div>
    );
}

// The Edit Popup, also updated to match backend keys
function ProfilePopup({ user, onClose, onSave }) {
    const [editableUser, setEditableUser] = useState({ ...user });
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(user.profilePic); // FIXED
    const [isUploading, setIsUploading] = useState(false);

    const handleTextChange = (e) => {
        const { name, value } = e.target;
        setEditableUser(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSaveClick = async () => {
        setIsUploading(true);
        let updatedUserData = { ...editableUser };

        if (profileImageFile) {
            const formData = new FormData();
            formData.append("image", profileImageFile);
            try {
                const uploadRes = await axios.post("http://localhost:8080/api/auth/upload/profile-image", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                updatedUserData.profilePic = uploadRes.data.imageUrl; // FIXED
            } catch (err) {
                console.error("Failed to upload image:", err);
                alert("Error uploading image.");
                setIsUploading(false);
                return;
            }
        }
        await onSave(updatedUserData);
        setIsUploading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[60]">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Profile</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FontAwesomeIcon icon={faTimes} size="lg" />
                    </button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex flex-col items-center space-y-2">
                        <div className="relative">
                            <img
                                    src={user.profilePic || `https://ui-avatars.com/api/auth/?name=${user.userName}&background=random`} // FIXED
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-200"
                                />
                            <label htmlFor="profile-image-input" className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                                <FontAwesomeIcon icon={faCamera} />
                            </label>
                        </div>
                        <input id="profile-image-input" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        <p className="text-sm text-gray-500">Click camera to change</p>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-600 mb-1 block">Full Name</label>
                        <input className="w-full p-3 border rounded-lg" type="text" name="userName" value={editableUser.userName} onChange={handleTextChange}/> {/* FIXED */}
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-gray-600 mb-1 block">Phone Number</label>
                        <input className="w-full p-3 border rounded-lg" type="text" name="phone" value={editableUser.phone} onChange={handleTextChange}/> {/* FIXED */}
                    </div>
                </div>
                <div className="flex justify-end space-x-4 bg-gray-50 p-4 rounded-b-2xl">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg" disabled={isUploading}>Cancel</button>
                    <button onClick={handleSaveClick} className="px-6 py-2 bg-blue-600 text-white rounded-lg w-36" disabled={isUploading}>
                        {isUploading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserProfileModal;