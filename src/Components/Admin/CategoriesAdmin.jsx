import React, { useState } from 'react'
import useCategories from '../../Hooks/useCategories/useCategories';
import { useUser } from '../../Context/UserProvider';
import CategoriesSkeleton from '../Feedback/Skeleton/CategoriesSkeleton';
import Heading from '../Common/Heading';


import Lottie from "lottie-react";
import NoData from "../../assets/LotiFiles/No_Data.json";
import CategoryAdmin from './CategoryAdmin';
import FormCategory from '../Categories/FormCategory';
import { Col, Row } from 'react-bootstrap';
import CategorySkeletonA from '../Feedback/SkeletonAdmin/CategorySkeltonA';
import SearchInput from '../Common/SearchInput';

const CategoriesAdmin = () => {

    const {
        categories,
        loading,
        error,
        RemoveCategory,
        AddCategory,
        EditCategory,
    } = useCategories();

    const [toggle, setToggle] = useState(false);

    const [initialData, setInitialData] = useState(null);

    const [searchData, setSearchData] = useState(null);


    const { user } = useUser();
    const userRoles = user?.userRoles || [];
    const isAdmin = userRoles.includes("Admin");


    const handleAdd = () => {
        setInitialData(null);
        setToggle(!toggle);
    };


    const handleEdit = (cat) => {
        setInitialData(cat);
        setToggle(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const displayedProducts = searchData !== null ? searchData : categories;


    if (loading) {
        return <CategorySkeletonA />;
    }

    if (error) return <>
        {isAdmin && (
            <div className="d-flex justify-content-between align-items-center mb-2">
                <Heading title="Categories" />

                {/* [Admin] Buuton Add New */}
                <button className="btn btn-success mb-4" onClick={handleAdd}>
                    {!toggle ? " Add Category " : "Close"}
                </button>
            </div>
        )}

        <ErrorsMessage message={error} />
    </>



    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-5 px-2 overflow-hidden ">
                <Heading title="Categories" />
                {/* <h1>Categories</h1> */}

                {isAdmin && (
                    <button className="btn btn-success " onClick={handleAdd}>
                        {!toggle ? "Add Category" : "Close"}
                    </button>
                )}

            </div>

            {isAdmin && (
                <FormCategory
                    toggle={toggle}
                    setToggle={setToggle}
                    initialData={initialData}
                    setInitialData={setInitialData}
                    AddCategory={AddCategory}
                    EditCategory={EditCategory}
                />
            )}

            <Row>
                {/* Search */}
                <div>
                    <SearchInput
                        data={categories}
                        searchKey="title"
                        placeholder="Search by Category Name"
                        setSearchData={setSearchData}
                    />
                </div>

                {displayedProducts.length > 0 ? (
                    displayedProducts.map((cat) => (
                        <Col
                            lg={6}
                            sm={6}
                            xs={12}
                            className="d-flex justify-content-center mb-5 mt-3 "
                            key={cat.categoryId}
                        >
                            <CategoryAdmin
                                id={cat.categoryId}
                                title={cat.title}
                                img={cat.imageData}
                                prefix={cat.prefix}
                                onEdit={() => handleEdit(cat)}
                                onDelete={() => RemoveCategory(cat.categoryId)}
                            />
                        </Col>
                    ))
                ) : (
                    <>
                        <div className="m-auto w-100" style={{ maxWidth: "600px" }}>
                            <Lottie animationData={NoData} loop={true} autoplay={true} />
                        </div>
                        <h3 className="text-center mt-2 fw-bold">No Categories Found</h3>
                    </>
                )}

            </Row>
        </>
    )
}

export default CategoriesAdmin