"use client";
import { useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

const serviceCategories = [
    { value: "plumbing", label: "Plumbing" },
    { value: "electrician", label: "Electrical" },
    { value: "cleaning", label: "Cleaning" },
    { value: "painting", label: "Painting" },
    { value: "carpenter", label: "Carpentry" },
    { value: "gardening", label: "Gardening" },
];

export default function RegisterPage() {
    const [userType, setUserType] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        location: "",
        file: null,
        password: "",
        specificServices: [] as string[],
        experience: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setError("File size must be less than 2MB");
                e.target.value = "";
                return;
            }
            if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
                setError("Only JPG, JPEG, and PNG files are allowed");
                e.target.value = "";
                return;
            }
            setFormData((prev) => ({ ...prev, file: file }));
            setError("");
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const apiFormData = new FormData();
        apiFormData.append("name", formData.fullName);
        apiFormData.append("email", formData.email);
        apiFormData.append("phone", formData.phoneNumber);
        apiFormData.append("location", formData.location);
        if (formData.file) {
            apiFormData.append("file", formData.file);
        }
        apiFormData.append("password", formData.password);
        apiFormData.append("role", userType);
        formData.specificServices.forEach((service) => {
            apiFormData.append("serviceType", service);
        });
        if (userType === "worker") {
            apiFormData.append("experience", formData.experience);
        }

        try {
            const response = await fetch("https://major-backend-f0nm.onrender.com/api/v1/users/register", {
                method: "POST",
                body: apiFormData,
            });
            //"http://localhost:5000/api/v1/users/register"
            console.log(response);
            const data = await response.json();

            if (response.ok) {
                console.log("Registration successful:", data);
                router.push("/login");
            } else {
                setError(data.message || "Registration failed");
                console.error("Registration failed:", data.message);
            }
        } catch (err) {
            setError("Network error or server unavailable");
            console.error("Error during registration:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 p-4">
            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl w-full max-w-4xl overflow-hidden">
                <div className="flex-1 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-h-[80vh] overflow-y-auto no-scrollbar"
                    >
                        <h2 className="text-3xl font-bold text-center text-indigo-900 mb-6">Register</h2>
                        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                        <form onSubmit={handleRegister} className="space-y-6">
                            <div>
                                <label htmlFor="userType" className="block text-sm font-medium text-indigo-900 mb-1">
                                    User Type
                                </label>
                                <Select onValueChange={setUserType} required>
                                    <SelectTrigger className="w-full bg-white text-indigo-900 border-[#C4DFDF]">
                                        <SelectValue placeholder="Select user type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectItem value="customer">Customer</SelectItem>
                                        <SelectItem value="worker">Worker</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {userType && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-indigo-900 mb-1">
                                            Full Name
                                        </label>
                                        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-[#F8F6F4] text-indigo-900 border-[#C4DFDF]" required />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-indigo-900 mb-1">
                                            Email Address
                                        </label>
                                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#F8F6F4] text-indigo-900 border-[#C4DFDF]" required />
                                    </div>
                                    <div>
                                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-indigo-900 mb-1">
                                            Phone Number
                                        </label>
                                        <Input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleInputChange} className="w-full bg-[#F8F6F4] text-indigo-900 border-[#C4DFDF]" required />
                                    </div>
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-indigo-900 mb-1">
                                            Location
                                        </label>
                                        <Textarea id="location" name="location" value={formData.location} onChange={handleInputChange} className="w-full bg-[#F8F6F4] text-indigo-900 border-[#C4DFDF]" required />
                                    </div>
                                    <div>
                                        <label htmlFor="photo" className="block text-sm font-medium text-indigo-900 mb-1">
                                            Photo
                                        </label>
                                        <Input id="photo" name="photo" type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="w-full bg-[#F8F6F4] text-indigo-900 border-[#C4DFDF]" required />
                                        <p className="mt-1 text-xs text-indigo-600">Maximum file size: 2MB. Accepted formats: JPG, JPEG, PNG</p>
                                    </div>
                                    {userType === "worker" && (
                                        <>
                                            <div>
                                                <label htmlFor="experience" className="block text-sm font-medium text-indigo-900 mb-1">
                                                    Experience (Years)
                                                </label>
                                                <Input id="experience" name="experience" type="number" value={formData.experience} onChange={handleInputChange} className="w-full bg-[#F8F6F4] text-indigo-900 border-[#C4DFDF]" required />
                                            </div>
                                            <div>
                                                <label htmlFor="serviceType" className="block text-sm font-medium text-indigo-900 mb-1">
                                                    Select Services
                                                </label>
                                                <Select
                                                    onValueChange={(value) => {
                                                        const currentServices = formData.specificServices;
                                                        if (currentServices.includes(value)) {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                specificServices: prev.specificServices.filter((service) => service !== value),
                                                            }));
                                                        } else {
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                specificServices: [...prev.specificServices, value],
                                                            }));
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full bg-white text-indigo-900 border-[#C4DFDF]">
                                                        <SelectValue placeholder="Select services (multiple)" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        {serviceCategories.map((service) => (
                                                            <SelectItem key={service.value} value={service.value}>
                                                                <div className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        checked={formData.specificServices.includes(service.value)}
                                                                        className="pointer-events-none"
                                                                    />
                                                                    <span>{service.label}</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {formData.specificServices.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {formData.specificServices.map((service) => (
                                                            <div
                                                                key={service}
                                                                className="bg-indigo-100 text-indigo-900 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                                                            >
                                                                <span>{serviceCategories.find((s) => s.value === service)?.label}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            specificServices: prev.specificServices.filter((s) => s !== service),
                                                                        }))
                                                                    }
                                                                    className="hover:text-indigo-700"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-indigo-900 mb-1">
                                            Password
                                        </label>
                                        <Input id="password" name="password" type="password" value={formData.password} onChange={handleInputChange} className="w-full bg-[#F8F6F4] text-indigo-900 border-[#C4DFDF]" required />
                                    </div>
                                </div>
                            )}
                            <Button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700" disabled={loading}>
                                {loading ? "Registering..." : "Register"}
                            </Button>
                        </form>
                        <p className="mt-4 text-center text-sm text-indigo-700">
                            Already have an account? <Link href="/login" className="font-medium text-indigo-900 hover:underline">Login here</Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}