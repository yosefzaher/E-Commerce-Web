import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { CgCloseO } from "react-icons/cg";
import useCategories from "../../Hooks/useCategories/useCategories";
import { useParams } from "react-router-dom";

const FormProduct = ({ toggle, setToggle, initialData, setInitialData, AddProduct, UpdateProduct }) => {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [categoryId, setcategoryId] = useState("")
    const [image, setImage] = useState(null)


    const { categories } = useCategories();
    const { prefix } = useParams();


    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setPrice(initialData.price);
            setStockQuantity(initialData.stockQuantity);
            setcategoryId(initialData.categoryId);
            setImage(null);
        }
    }, [initialData]);

    // to make Form Category Default About Prefix
    useEffect(() => {
        if (!initialData && prefix && categories.length > 0) {
            const matchCategory = categories.find((cat) => cat.title.toLowerCase() === prefix.toLowerCase());
            if (matchCategory) {
                setcategoryId(matchCategory.categoryId);
            }
        }
    }, [prefix, categories, initialData, toggle])


    const handelSubmit = async (e) => {
        e.preventDefault();
        try {

            const catId = parseInt(categoryId);
            const pr = parseFloat(price);
            const stock = parseInt(stockQuantity);

            if (initialData) {

                await UpdateProduct(
                    initialData.productId,
                    image,
                    title,
                    description,
                    pr,
                    stock,
                    catId,
                );

                setInitialData(null);
                setToggle(false)

            } else {

                await AddProduct(
                    image,
                    title,
                    description,
                    pr,
                    stock,
                    catId,
                );
                setToggle(false)
            }

            // reset form
            setTitle("");
            setDescription("");
            setPrice("");
            setStockQuantity("");
            setcategoryId("");
            setImage(null);

        } catch (error) {
            console.error("Error adding product:", error);
        }

    }

    const Cancel = async () => {

        // reset form
        setTitle("");
        setDescription("");
        setPrice("");
        setStockQuantity("");
        setcategoryId("");
        setImage(null);

        setInitialData(null);
        setToggle(false)
    }

    return (
        <div>
            {toggle && (
                <div className="shadow-lg p-2 mb-5 position-relative rounded rounded-2">

                    {/* Close Button */}
                    <button
                        className="btn close-btn position-absolute p-1"
                        style={{ right: "10px", top: "10px" }}
                        onClick={Cancel}
                    >
                        <span className="d-flex justify-content-center align-items-center bg-danger rounded-pill text-white">
                            <CgCloseO size={20} />
                        </span>
                    </button>

                    <h2 className="text-center mt-3">Add Product </h2>

                    <Form className="p-4" onSubmit={handelSubmit} >

                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Name"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Name"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Stock Quantity</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Stock Quantity"
                                value={stockQuantity}
                                onChange={(e) => setStockQuantity(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Image Product</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={(e) => setImage(e.target.files[0])}
                                required
                            />
                            <Form.Text className="text-muted">
                                Select image for Product
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                value={categoryId}
                                onChange={(e) => setcategoryId(e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat.categoryId} value={cat.categoryId}>
                                        {cat.title}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex align-items-center">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </div>
                    </Form>
                </div>
            )}
        </div>
    );
};

export default FormProduct;
