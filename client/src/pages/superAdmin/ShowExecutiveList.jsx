
import React, { useState } from "react";
import { Plus, X, Users, FileSpreadsheet } from "lucide-react";
import { useEffect } from "react";
import api from "../../api/axiosInstance";
import toast from "react-hot-toast";


const BASE_URL = import.meta.env.VITE_API_URL;


const ShowExecutiveList = () => {
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        role: "executive",
        password: "",
    });

    // Sample data for UI
    const [executives, setExecutives] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newExecutive = {
            name: formData.name.trim(),
            role: formData.role,
            password: formData.password
        };

        try {

            const res = await api.post(
                `${BASE_URL}/api/v1/admin/create-executive-person`,
                { ...newExecutive }
            );

            if (res?.data?.success) {
                toast.success(res?.data?.message);
                setExecutives((prev) => [...prev, res?.data?.data]);
            }

        } catch (er) {
            console.log(er)
        }
        finally {

            setFormData({
                name: "",
                role: "executive",
                password: "",
            });

            setShowModal(false);
        }


    };

    const handleExport = async (userId) => {
        try {
            const res = await api.get(
                `${BASE_URL}/api/v1/admin/${userId}/export`,
                 { responseType: 'blob' }
            );

            const blob = new Blob([res.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${userId}-leads.xlsx`;

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (er) {
            console.log(er)
        }
    }

    useEffect(() => {
        const fetchExecutive = async () => {
            try {

                const res = await api.get(
                    `${BASE_URL}/api/v1/admin/all-executive`,
                );
                if (res?.data?.success) {
                    setExecutives(res?.data?.executives)
                }
            } catch (er) {
                console.log(er);
            }
        }
        fetchExecutive();
    }, [])

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Team Members
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage executives and administrators.
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e60012] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#c90010]"
                >
                    <Plus size={18} />
                    Add Executive
                </button>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
                    <Users size={20} className="text-gray-500" />
                    <h2 className="font-semibold text-gray-800">
                        All Team Members
                    </h2>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {executives.length}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                            <tr>
                                <th className="px-5 py-4 font-semibold">#</th>
                                <th className="px-5 py-4 font-semibold">UserId</th>
                                <th className="px-5 py-4 font-semibold">Name</th>
                                <th className="px-5 py-4 font-semibold">Role</th>
                                <th className="px-5 py-4 font-semibold">TotalLeads</th>
                                <th className="px-5 py-4 font-semibold">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {executives.map((member, index) => (
                                <tr
                                    key={member._id}
                                    className="transition hover:bg-gray-50"
                                >
                                    <td className="px-5 py-4 text-gray-500">
                                        {index + 1}
                                    </td>

                                    <td className="px-5 py-4 font-medium text-gray-900">
                                        {member.userId}
                                    </td>
                                    <td className="px-5 py-4 capitalize font-medium text-gray-900">
                                        {member.name}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${member.role === "super_admin"
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-blue-100 text-blue-700"
                                                }`}
                                        >
                                            {member.role === "super_admin"
                                                ? "Super Admin"
                                                : "Executive"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 capitalize font-medium text-gray-900">
                                        {member.leadCount}
                                    </td>

                                    <td>

                                        <button
                                            onClick={() => handleExport(member.userId)}
                                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-2 py-2.5 text-xs text-green-700 transition-all duration-200 hover:border-green-300 hover:bg-green-100 hover:shadow-sm active:scale-95"
                                        >
                                            <FileSpreadsheet size={17} />
                                            Export Data
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {executives.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="px-5 py-12 text-center text-gray-500"
                                    >
                                        No team members found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Executive Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowModal(false);
                        }
                    }}
                >
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Add Team Member
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Enter the account details below.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                aria-label="Close modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 p-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-[#e60012] focus:ring-2 focus:ring-red-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none focus:border-[#e60012] focus:ring-2 focus:ring-red-100"
                                >
                                    <option value="executive">Executive</option>
                                    <option value="super_admin">Super Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter initial password"
                                    minLength={3}
                                    autoComplete="new-password"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-[#e60012] focus:ring-2 focus:ring-red-100"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Use at least 3 characters.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-lg bg-[#e60012] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#c90010]"
                                >
                                    Add Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShowExecutiveList;
