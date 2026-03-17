import { useParams } from "react-router-dom";
import { useProduct } from "../Context/ProductProvider";
import Product from "../Components/Products/Product";
import { Col, Row } from "react-bootstrap";

import Lottie from "lottie-react";
import NoData from "../assets/LotiFiles/No_Data.json";
import ProductSkeleton from "../Components/Feedback/Skeleton/ProductSkeleton";

import FormProduct from "../Components/Products/FormProduct";
import { useMemo, useRef, useState } from "react";

import { useUser } from "../Context/UserProvider";
import Heading from "../Components/Common/Heading";
import SearchInput from "../Components/Common/SearchInput";
import useCategories from "../Hooks/useCategories/useCategories";

const Products = () => {
    const { prefix } = useParams();

    const { product, loading, error, RemoveProduct, AddProduct, UpdateProduct } = useProduct();
    const { categories } = useCategories();


    const [toggle, setToggle] = useState(false);

    const [initialData, setInitialData] = useState(null);

    const [searchData, setSearchData] = useState(null);

    const { user } = useUser();
    const userRoles = user?.userRoles || [];
    const isAdmin = userRoles.includes("Admin");


    const handleEdit = (pro) => {
        setInitialData(pro);
        setToggle(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Resolve the URL prefix to the actual category — match by Code OR Title (case-insensitive)
    const matchedCategory = useMemo(() => {
        if (!prefix || categories.length === 0) return null;
        const lowerPrefix = prefix.toLowerCase();
        return (
            categories.find((cat) => cat.prefix?.toLowerCase() === lowerPrefix) ||
            categories.find((cat) => cat.title?.toLowerCase() === lowerPrefix)
        );
    }, [prefix, categories]);

    const filteredProducts = useMemo(() => {
        if (!matchedCategory) return [];
        const categoryTitle = matchedCategory.title?.toLowerCase();
        return product.filter(
            (item) => item?.categoryName?.toLowerCase() === categoryTitle
        );
    }, [product, matchedCategory]);

    // Show the resolved category name in the heading, or the raw URL prefix as fallback
    const displayName = matchedCategory?.title || prefix;


    const displayedProducts = searchData !== null ? searchData : filteredProducts;

    if (loading) {
        return <ProductSkeleton />;
    }

    if (error) {
        return <>
            <div className="d-flex justify-content-between align-items-center mb-2">

                <Heading title={`Products ${displayName}`} />

                {isAdmin && (
                    <button
                        className="btn btn-success mb-4"
                        onClick={() => setToggle(!toggle)}
                    >
                        {!toggle ? " Add Product " : "close"}
                    </button>
                )}

            </div>
            <ErrorsMessage message={error} title={"No Product Found"} />
        </>
    }

    return (
        <div className="container mt-4 ">
            <div className="d-flex justify-content-between align-items-center mb-4 overflow-hidden">
                <Heading title={`Products ${displayName}`} />

                {/* to can Add Product */}
                {isAdmin && (
                    <button
                        className="btn btn-success "
                        onClick={() => setToggle(!toggle)}
                    >
                        {!toggle ? " Add Product " : "Close"}
                    </button>
                )}
            </div>
            {/* to Show form Category */}
            {isAdmin && (
                <FormProduct
                    toggle={toggle}
                    setToggle={setToggle}
                    initialData={initialData}
                    setInitialData={setInitialData}
                    AddProduct={AddProduct}
                    UpdateProduct={UpdateProduct}
                />
            )}

            <div className="overflow-hidden">
                <Row className="p-2 ">

                    <div>
                        <SearchInput
                            data={filteredProducts}
                            searchKey="title"
                            placeholder="Search by Product Name"
                            setSearchData={setSearchData}
                        />
                    </div>

                    {displayedProducts.length > 0 ? (
                        displayedProducts.map((item) => (
                            <Col
                                key={item.productId}
                                lg={3}
                                md={4}
                                sm={6}
                                xs={6}
                                className="my-2"
                            >
                                <Product
                                    prefix={prefix}
                                    id={item.productId}
                                    title={item.title}
                                    description={item.description}
                                    img={item.image}
                                    price={item.price}
                                    max={item.stockQuantity}
                                    cat_prefix={item.categoryName}
                                    onEdit={() => handleEdit(item)}
                                    onDelete={() => RemoveProduct(item.productId)}
                                />
                            </Col>
                        ))
                    ) : (
                        <>
                            <div className="m-auto w-100" style={{ maxWidth: "600px" }}>
                                <Lottie animationData={NoData} loop={true} autoplay={true} />
                            </div>
                            <h3 className="text-center mt-2 fw-bold">No Products Found</h3>
                        </>
                    )}
                </Row>
            </div>
        </div>
    );
};

export default Products;
