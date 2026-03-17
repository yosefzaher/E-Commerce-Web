import React, { useEffect, useState } from "react";

import Swal from "sweetalert2";
import { useUser } from "../../Context/UserProvider";
import api from "../../services/axios-global";

const useCategories = () => {
    const { token } = useUser();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const GetAllCategories = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/Categories/GetAllCategories`);
            const data = res.data;
            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetAllCategories();
    }, []);

    const AddCategory = async (title, prefix, image) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("prefix", prefix);
            formData.append("imageData", image);

            const res = await api.post("/Categories/AddCategory", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // Optimistic update
            setCategories((prev) => [...prev, res.data]);
            await GetAllCategories();

            return res.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const EditCategory = async (id, title, prefix, image) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("prefix", prefix);
            if (image) formData.append("imageData", image);

            const res = await api.put(`/Categories/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setCategories((prev) =>
                prev.map((c) => (c.categoryId === id ? res.data : c))
            );

            await GetAllCategories();

            return res.data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const RemoveCategory = async (id) => {
        const { isConfirmed: step1 } = await Swal.fire({
            title: "Remove Category?",
            text: "Are you sure you want to remove this category?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, remove it!",
        });
        if (!step1) return;

        const { isConfirmed: step2 } = await Swal.fire({
            title: "Warning!",
            text: "Removing this category will also delete all linked products. Continue?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, continue",
        });
        if (!step2) return;

        try {
            setLoading(true);

            const res = await api.delete(`/Categories/${id}`);

            setCategories((prev) => prev.filter((c) => c.categoryId !== id));
            await GetAllCategories();

            return res.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        categories,
        loading,
        error,
        GetAllCategories,
        AddCategory,
        EditCategory,
        RemoveCategory,
    };
};

export default useCategories;
