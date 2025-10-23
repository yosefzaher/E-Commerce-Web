import { Link } from 'react-router-dom';


import { SlOptionsVertical } from "react-icons/sl";
import { IoMdClose } from "react-icons/io";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";




import img1 from "../../assets/Cat_Image/download.jpg"
import { useState } from 'react';
import { useUser } from '../../Context/UserProvider';

const CategoryAdmin = ({ title, img, prefix, onEdit, onDelete, id }) => {

    const [menuOpen, setMenuOpen] = useState(false);

    const handleDelete = () => {
        onDelete(id)
        setMenuOpen(false)
    }

    const { user } = useUser();
    const userRoles = user?.userRoles || [];
    const isAdmin = userRoles.includes("Admin");

    return (
        <div className="category position-relative  p-1  overflow-hidden w-100 overflow-x-hidden shadow">
            <Link to={`/categories/products/${prefix}`} className='text-decoration-none'>
                <div className='d-flex flex-column flex-md-row justify-content-between align-items-center shadow rounded-3 pe-md-5 py-md-1 py-2'>

                    {/* Image */}
                    <div className="">

                        {img ?
                            (
                                <img
                                    src={`data:image/png;base64,${img}`}
                                    alt={title}
                                    width={200}
                                    height={200}
                                    style={{ objectFit: "fill" }}
                                    className='p-2'
                                />
                            )
                            : (
                                <img
                                    src={img1}
                                    alt="No Iamge"
                                />
                            )
                        }

                    </div>

                    <div className='d-flex flex-md-row flex-column text-center gap-3 px-lg-3  px-2 '>
                        <h4 className="text-black fw-semibold">{title}</h4>
                    </div>

                </div>
            </Link>

            <div
                className="d-flex flex-sm-row flex-column  justify-content-between gap-3 p-2"
                style={{ right: "30px", top: "5px", zIndex: 1350 }}
            >
                <button
                    className="btn btn-outline-info fw-bold w-100 text-start "
                    onClick={() => {
                        onEdit();
                        setMenuOpen(false);
                    }}
                    title='Edit'
                >
                    <span className='d-flex align-items-center justify-content-center gap-2'> <span>Edit</span> <FaRegEdit size={18}/></span>
                </button>
                <button
                    className="btn btn-outline-danger fw-bold w-100 text-start "
                    onClick={handleDelete}
                    title='Delete'
                >
                    <span className='d-flex align-items-center justify-content-center gap-2'> <span>Delete</span> <MdDeleteOutline size={22} /></span>
                </button>
            </div>

            {/* </Link> */}
        </div>
    );
};

export default CategoryAdmin;