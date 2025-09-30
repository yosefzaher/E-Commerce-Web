import React from "react";
import Heading from "../Components/Common/Heading";
import { Col, Row, Spinner } from "react-bootstrap";
import { useShipOrder } from "../Context/ShipOrders/ShipProvider";
import { useUser } from "../Context/UserProvider";
import { MdLocalShipping } from "react-icons/md";
import Swal from "sweetalert2";

const Shiping = () => {
    const { ShipOrders, loading, error, ClearUserShippedOrders } = useShipOrder();
    const { user } = useUser();
    const userId = user.id;

    const handleDelete = async (userId, orderId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will delete the order and you will not be able to undo it!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await ClearUserShippedOrders(userId, orderId);

                    Swal.fire(
                        "Deleted!",
                        "The order has been deleted successfully.",
                        "success"
                    );
                } catch (error) {
                    Swal.fire(
                        "Error",
                        "An error occurred while deleting. Please try again.",
                        "error"
                    );
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center mt-5">
                <Spinner animation="border" variant="info" />
            </div>
        );
    }

    if (error) return <p className=" text-center fs-2 fw-semibold" style={{ marginTop: "100px" }}>{error}</p>;

    return (
        <div>
            <Heading title={`Shiping Orders`} />

            <Row className="mt-4">
                {ShipOrders.length === 0 ? (
                    <p>No shipped orders found.</p>
                ) : (
                    ShipOrders.map((sh) => (
                        <Col lg={4} md={4} sm={6} xs={12} key={sh.orderId} className="mb-3">
                            <div className="px-3 py-2 border rounded shadow order-card">
                                <p className="fs-5 fw-bold">Order ID: {sh.orderId}</p>
                                <p className="fs-5 fw-bold">Count: {sh.countOfItems}</p>
                                <p className="fs-5 fw-bold">Total: {sh.totalAmoutForeachOrder} EGP</p>
                                <div className="fs-5 fw-bold d-flex align-items-center gap-2">
                                    Status:
                                    <div className="text-success fs-4 fw-bold d-flex align-items-center gap-2 ">
                                        <span>{sh.orderStatus} </span>
                                        <span><MdLocalShipping size={30} className="mt-1" /></span>
                                    </div>
                                </div>
                                <div className="" title="Delete">
                                    <button
                                        className="btn btn-danger mt-2"
                                        // replce userId sh.userID
                                        onClick={() => handleDelete(sh.userId, sh.orderId)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </Col>
                    ))
                )}
            </Row>
        </div>
    );
};

export default Shiping;
