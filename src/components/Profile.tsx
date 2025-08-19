import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import Layout from "./Layout";
import useApi from "../services/useApi";

interface User {
    id: number;
    name: string;
    email: string;
    profile_image: string;
    created_at: string;
}

export default function ProfilePage() {
    const {  error, callApi } = useApi();

    const emptyUser: User = {
        id: 0,
        name: "",
        email: "",
        profile_image: "",
        created_at: "",
    };

    const [user, setUser] = useState<User>(emptyUser);
    const [formData, setFormData] = useState<User>(emptyUser);
    const [editMode, setEditMode] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");

    useEffect(() => {
        getUserProfile();
    }, []);

    const getUserProfile = async () => {
        try {
            const response = await callApi("get", "/profile");
            if (response.status) {
                setUser(response.data);
                setFormData(response.data);
            }
        } catch (err) {
            console.error("Error fetching profile", err);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, profile_image: imageUrl }));
        }
    };

    const handleSave = async () => {
        console.log(formData);
        const response = await callApi('post', '/update-profile', formData);
        console.log(response);
        if (response.status) {
            setUpdateMessage(response.message);
            setUser(response.data)
        }
        // Here you would call API to save changes
    };

    return (
        <Layout>
            <div className="max-w-xl mx-auto mt-4 mb-4 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-gray-800 p-6 text-center text-white">
                    <h1 className="text-3xl font-bold">
                        {editMode ? "Edit Profile" : "My Profile"}
                    </h1>
                </div>

                {/* Profile Content */}
                <div className="p-6 flex flex-col items-center">
                    {/* <div className="relative group">
            <img
              src={editMode ? formData.profile_image : user.profile_image}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {editMode && (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-3 text-sm text-gray-600"
              />
            )}
          </div> */}

                    <div className="relative group">
                        {editMode
                            ? formData.profile_image
                                ? (
                                    <img
                                        src={formData.profile_image}
                                        alt={formData.name || "Profile"}
                                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                )
                                : (
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )
                            : user.profile_image
                                ? (
                                    <img
                                        src={user.profile_image}
                                        alt={user.name || "Profile"}
                                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                )
                                : (
                                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )
                        }

                        {editMode && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-3 text-sm text-gray-600"
                            />
                        )}
                    </div>


                    {editMode ? (
                        <>
                            <div className="w-full mt-6 space-y-4">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Name"
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            {updateMessage && updateMessage && <p className="text-green-500">{updateMessage}</p>}
                            {error && <p className="text-red-500">{error}</p>}
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-semibold mt-4">{user.name}</h2>
                            <p className="text-gray-500">{user.email}</p>
                        </>
                    )}

                    <div className="mt-6 w-full border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium">User ID:</span>
                            <span>{user.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Account Created:</span>
                            <span>
                                {user.created_at
                                    ? new Date(user.created_at).toLocaleDateString()
                                    : ""}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-4">
                        {editMode ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="px-5 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setFormData(user);
                                        setEditMode(false);
                                        setUpdateMessage("");
                                    }}
                                    className="px-5 py-2 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                //   disabled={true}
                                onClick={() => setEditMode(true)}
                                className="px-5 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
