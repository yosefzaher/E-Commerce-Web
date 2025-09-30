import React, { useEffect, useState } from "react";
import api from "../services/axios-global";
import LoadingSpinner from "../Components/Common/LoadingSpinner";
import ErrorsMessage from "../Components/Common/ErrorsMessage";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";
import { BiShoppingBag } from "react-icons/bi";
import { Button, Form, Modal } from "react-bootstrap";
import { useShipOrder } from "../Context/ShipOrders/ShipProvider";
import { ToastContainer } from "react-toastify";
const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");


    const token = localStorage.getItem("token");

    const GetUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/Users`);
            setUsers(res.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetUsers();
    }, []);

    const DeleteUser = async (userId) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!",
            });

            if (!result.isConfirmed) return;

            const res = await api.delete(`/Users/DeleteUserByID`, {
                params: { id: userId },
            });

            if (res.status === 200) {
                await GetUsers();

                Swal.fire({
                    title: "Deleted!",
                    text: "✅ User deleted successfully.",
                    icon: "success",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }

            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
        } catch (err) {
            setError("Error In Delete User", err);

            Swal.fire({
                title: "Error!",
                text: "Failed to delete user. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    const [orders, setOrders] = useState([]);
    console.log(orders)
    const [selectedUser, setSelectedUser] = useState(null);
    console.log(selectedUser)
    const [showOrdersModal, setShowOrdersModal] = useState(false);

    const GetUserOrders = async (userId) => {
        if (!userId) return;
        setLoading(true);
        setError(null);
        setOrders([]);
        setSelectedUser(userId);
        setShowOrdersModal(true);
        try {
            const res = await api.get(`/Orders/GetUserOrders/${userId}`);

            if (!res.data || res.data.length === 0) {
                setOrders([]);
                return;
            }

            setOrders(res.data);
        } catch (err) {
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]);

    const OrderDetails = async (orderId) => {
        setLoading(true);
        setOrderDetails([]);
        try {
            const res = await api.get(`/Orders/GetProductsDetails/${selectedUser}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { orderId },
            });

            setOrderDetails(res.data);
            setSelectedOrder(orderId);
            return res.data;
        } catch (error) {
            setError("Error in Show Details:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !showOrdersModal) {
        return <LoadingSpinner message="Loading Users..." size={"lg"} />;
    }

    if (error) {
        return <ErrorsMessage message={error} />;
    }

    const onClsoe = () => {
        setSelectedOrder(null);
        setOrderDetails([]);
        setShowOrdersModal(false)
    }


    const filteredUsers = users.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return (
            user.id.toString().includes(search) ||
            fullName.includes(search.toLowerCase())
        );
    });

    const { ClearUserShippedOrders } = useShipOrder();

    const handleDeleteOrder = async (userId, orderId) => {
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
                    onClsoe();
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


    return (
        <>
            {/* <ToastContainer /> */}
            <h1 className="fw-bold">Users</h1>

            <div className="mb-3 mt-4 px-sm-5 px-3">
                <Form.Control
                    type="text"
                    placeholder="Search by ID or Name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div>
                {filteredUsers.length === 0 ? (
                    <p className="fs-2 fw-semibold text-center mt-5">No users found</p>
                ) : (
                    <div className="table-responsive mt-5">
                        <table className="table table-striped table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>ID</th>
                                    <th>FirstName</th>
                                    <th>LastName</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Orders</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, idx) => (
                                    <tr key={user.id}>
                                        <td>{idx + 1}</td>
                                        <td>{user.id}</td>
                                        <td>{user.firstName}</td>
                                        <td>{user.lastName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.phoneNumber || "---- ---- ----"}</td>
                                        <td>
                                            {
                                                <button
                                                    className=" btn btn-info fw-bold text-white"
                                                    title="Order"
                                                    onClick={() => GetUserOrders(user?.id)}
                                                >
                                                    <BiShoppingBag size={22} />
                                                </button>
                                            }
                                        </td>
                                        <td>
                                            <button
                                                className=" btn btn-danger fw-bold"
                                                title="Delete User"
                                                onClick={() => DeleteUser(user.id)}
                                            >
                                                <MdDeleteOutline size={22} className="" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <Modal
                show={showOrdersModal}
                onHide={onClsoe}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {selectedOrder
                            ? `Order Details - ${selectedOrder}`
                            : `User Orders - ${selectedUser}`}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loading ? (
                        <LoadingSpinner
                            message={
                                selectedOrder ? "Loading Order Details..." : "Loading Orders..."
                            }
                            size={"sm"}
                        />
                    ) : selectedOrder ? (
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Product</th>
                                        <th>image</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderDetails.map((item, idx) => (
                                        <tr key={item.productId}>
                                            <td>{idx + 1}</td>
                                            <td>{item.productTitle}</td>
                                            <td>
                                                <img
                                                    src={`data:image/png;base64,${item.productImage}`}
                                                    alt={item.productTitle}
                                                    width={80}
                                                    height={80}
                                                />
                                            </td>
                                            <td>{item.productQuantityInOrderItems}</td>
                                            <td>{item.totalAmountForeachProduct}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : orders.length === 0 ? (
                        <p className="text-center text-muted">
                            No orders found for this user.
                        </p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Order ID</th>
                                        <th>Status</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Details</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, idx) => (
                                        <tr key={order.orderId}>
                                            <td>{idx + 1}</td>
                                            <td>{order.orderId}</td>
                                            <td>
                                                {order.orderStatus === "Shipped" ? (
                                                    <span className=" bg-success p-1 fw-semibold text-white rounded">Shipped</span>
                                                ) : order.orderStatus === "Pending" ? (
                                                    <span className=" bg-warning text-dark p-1 fw-semibold rounded">Pending</span>
                                                ) : (
                                                    <span className=" bg-secondary p-2">{order.orderStatus}</span>
                                                )}
                                            </td>
                                            <td>{order.countOfItems}</td>
                                            <td>{order.totalAmoutForeachOrder}</td>
                                            <td>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => OrderDetails(order.orderId)}
                                                >
                                                    View
                                                </Button>
                                            </td>

                                            <td>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => { handleDeleteOrder(selectedUser, order.orderId) }}
                                                    disabled={order.orderStatus !== "Shipped"}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {selectedOrder && (
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setSelectedOrder(null);
                                setOrderDetails([]);
                            }}
                        >
                            Back to Orders
                        </Button>
                    )}
                    <Button variant="secondary" onClick={onClsoe}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Users;
