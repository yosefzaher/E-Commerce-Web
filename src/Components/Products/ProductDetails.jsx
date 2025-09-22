import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProduct } from "../../Context/ProductProvider";
import ButtonAddToCart from "../Common/ButtonAddToCart";
import { UseCart } from "../../Context/CartProvider";
import Heading from "../Common/Heading";

const ProductDetails = () => {
    const { prefix, id } = useParams();

    const { product } = useProduct();

    // to identify product
    const specificProduct = product.find((p) => p.productId === parseInt(id));


    const { cart } = UseCart();

    const existingItem = cart.items.find(
        (item) => item.productId === parseInt(id)
    );
    const QuantityinCart = existingItem ? existingItem.quantity : 0;

    const AvailableStock = specificProduct?.stockQuantity - QuantityinCart;

    return (
        <div className="container mt-5">
            <Heading title={`Product Details`} />

            {specificProduct ? (
                <div className="card mt-3 p-4 shadow-sm">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center mb-3 mb-md-0 ">
                            <img
                                src={`data:image/png;base64,${specificProduct.image}`}
                                alt={specificProduct.title}
                                style={{
                                    objectFit: "contain",
                                    width: "100%",
                                    maxWidth: "400px",
                                    height: "430px",
                                }}
                                className="img-fluid rounded shadow-sm"
                            />
                        </div>

                        <div className="col-md-6 d-flex flex-column gap-4 justify-content-center shadow py-4 px-4 my-sm-4 ">
                            {/* <h5><span className="fw-bold p-2">Product ID:</span> <span className="badge bg-info"> {id} </span></h5> */}
                            <h3>
                                <span className="fw-bold me-3">Title:</span>
                                <span className="badge bg-info">{specificProduct.title}</span>
                            </h3>
                            <div>
                                <span className="fw-bold fs-4  me-3">Description:</span> <br />
                                <span className="fw-semibold text-muted ">
                                    {specificProduct.description}
                                </span>
                            </div>
                            <h3>
                                <span className="fw-bold me-3">Available:</span>
                                <span className="badge bg-info">

                                    {AvailableStock} Stock
                                </span>
                            </h3>
                            <h3 className="my-2">
                                <span className="fw-bold me-3">Price:</span>
                                <span className="badge bg-info">

                                    {specificProduct.price
                                        ? specificProduct.price.toFixed(2)
                                        : "0"}
                                    EGP
                                </span>
                            </h3>
                            <h3>
                                <span className="fw-bold me-3">Category:</span>
                                <span className="badge bg-info"> {prefix} </span>
                            </h3>
                        </div>

                        <div className="d-flex justify-content-center pt-3">
                            <ButtonAddToCart
                                productId={specificProduct.productId}
                                title={specificProduct.title}
                                price={specificProduct.price}
                                max={specificProduct.stockQuantity}
                                img={specificProduct.image}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-danger">Product not found.</p>
            )}
        </div>
    );
};

export default ProductDetails;
