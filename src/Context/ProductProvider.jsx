import axios, { AxiosError } from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useUser } from "./UserProvider";
import api from "../services/axios-global";

const ProductContext = createContext();

export const useProduct = () => useContext(ProductContext);

const ProductProvider = ({ children }) => {


    const [product, setProduct] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const GetProducts = async () => {
        try {
            setLoading(true);
            const res = await api.get(
                `/Products/GetAllProucts`
            );
            const data = res.data;
            setProduct(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetProducts();
    }, []);

    const AddProduct = async (
        image,
        title,
        description,
        price,
        stockQuantity,
        categoryId
    ) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("stockQuantity", stockQuantity);
            formData.append("categoryId", categoryId);
            formData.append("image", image);

            const res = await api.post(
                `/Products/AddProdcut`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        // Authorization: `Bearer ${token}`,
                    },
                }
            );

            // setProduct((prev) => [...prev, res.data]);
            await GetProducts();
            return res.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const UpdateProduct = async (
        productId,
        image,
        title,
        description,
        price,
        stockQuantity,
        categoryId
    ) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("stockQuantity", stockQuantity);
            formData.append("categoryId", categoryId);
            if (image) formData.append("image", image);

            const res = await api.put(
                `/Products/${productId}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        // Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProduct((prev) =>
                prev.map((p) => (p.productId === productId ? res.data : p))
            );

            await GetProducts();

            return res.data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const RemoveProduct = async (productId) => {
        const { isConfirmed: step1 } = await Swal.fire({
            title: "Remove Product?",
            text: "Are you sure you want to remove this Product?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, remove it!",
        });
        if (!step1) return;
        try {
            setLoading(true);
            const res = await api.delete(
                `/Products/${productId}`,
                {
                    headers: {
                        // Authorization: `Bearer ${token}`,
                    }
                }
            );
            setProduct((prev) => prev.filter((p) => p.productId !== productId));

            await GetProducts();
            console.log(res.data)
            return res.data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProductContext.Provider
            value={{
                product,
                loading,
                error,
                setProduct,
                AddProduct,
                UpdateProduct,
                RemoveProduct,
                GetProducts,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;
