import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserProfileHeader({ onClick }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const email = localStorage.getItem("loggedInEmail");
        if (email) {
            axios
                .get(`http://localhost:8080/api/auth/users/email?email=${email}`)
                .then((res) => {
                    setUser(res.data);
                    
                })
                .catch((err) => {
                    console.error("Failed to fetch user:", err);
                });
        }
    }, []);

    if (!user) {
        return (
            <div className="flex items-center p-3 h-20 border-b border-gray-200">
                <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
                <div className="ml-4 flex-1">
                    <div className="w-3/4 h-5 bg-gray-300 rounded animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className="flex items-center p-3 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
        >
            <img
                src={
                    user.profilePic
                        ? user.profilePic
                        : `https://ui-avatars.com/api/?name=${user.userName}&background=random`
                }
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-4 flex-1">
                <h2 className="text-lg font-semibold text-gray-800">
                    {user.userName} (You)
                </h2>
               
                {user.phone && (
                    <p className="text-sm text-gray-500">📞 {user.phone}</p>
                )}
            </div>
        </div>
    );
}

export default UserProfileHeader;
