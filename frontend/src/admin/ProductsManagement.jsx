import { useEffect, useState } from "react";
import EditProduct from "./EditProduct";
import {
    getAdminProducts,
    deleteProduct
} from "../services/productAdminService";

import AdminLayout from "../components/admin/AdminLayout";

import AddProduct from "./AddProduct";


function ProductsManagement(){

    const [products,setProducts] = useState([]);

    const [loading,setLoading] = useState(true);

    const [error,setError] = useState("");

    const loadProducts = async()=>{

        try{

            setLoading(true);

            const data = await getAdminProducts();

            setProducts(data);


        }catch(error){

            setError(error.message);


        }finally{

            setLoading(false);

    };

    const handleDelete = async (id, name) => {
        const confirmDelete = window.confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`);
        if (!confirmDelete) return;

        try {
            setLoading(true);
            await deleteProduct(id);
            alert("Produk berhasil dihapus");
            loadProducts();
        } catch (err) {
            alert(err.message || "Gagal menghapus produk");
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=>{

        loadProducts();

    },[]);

    const formatRupiah = (number)=>{

        return new Intl.NumberFormat(
            "id-ID",
            {
                style:"currency",
                currency:"IDR"
            }
        ).format(number);

    };

    const [showForm,setShowForm]
    =
    useState(false);

    const [editProduct,setEditProduct] = useState(null);

    return (

    <AdminLayout>


        <div>


            <div className="
            flex
            justify-between
            items-center
            mb-8
            ">


                <h1 className="
                text-3xl
                font-bold
                ">

                    Products Management

                </h1>



                <button

                onClick={()=>setShowForm(true)}

                className="
                bg-black
                text-white
                px-5
                py-3
                rounded-lg
                "

                >

                + Add Product

                </button>


            </div>



            {
                loading && (

                    <p>
                        Loading products...
                    </p>

                )
            }



            {
                error && (

                    <p className="
                    text-red-500
                    ">

                        {error}

                    </p>

                )
            }



            {
                !loading &&
                products.length === 0 && (

                    <div className="
                    bg-white
                    p-8
                    rounded-xl
                    text-center
                    ">

                        Belum ada produk.

                    </div>

                )
            }

            {
            showForm && (

            <AddProduct

            closeForm={()=>setShowForm(false)}

            refreshProducts={loadProducts}

            />

            )
            }

            {
                editProduct && (

                <EditProduct

                product={editProduct}

                closeForm={()=>
                setEditProduct(null)
                }

                refreshProducts={loadProducts}

                />

                )
            }

            {
                !loading &&
                products.length > 0 && (


                <div className="
                bg-white
                rounded-xl
                shadow
                overflow-hidden
                ">


                    <table className="
                    w-full
                    ">


                    <thead className="
                    bg-gray-100
                    ">

                    <tr>


                    <th className="
                    p-4
                    text-left
                    ">
                        Product
                    </th>


                    <th className="
                    p-4
                    ">
                        Category
                    </th>


                    <th className="
                    p-4
                    ">
                        Price
                    </th>


                    <th className="
                    p-4
                    ">
                        Stock
                    </th>


                    <th className="
                    p-4
                    ">
                        Action
                    </th>


                    </tr>


                    </thead>



                    <tbody>


                    {
                        products.map((product)=>(


                        <tr
                        key={product.id}
                        className="
                        border-t
                        "
                        >


                            <td className="
                            p-4
                            ">

                                {product.name}

                            </td>



                            <td className="
                            text-center
                            ">

                                {product.category}

                            </td>



                            <td className="
                            text-center
                            ">

                                {formatRupiah(product.price)}

                            </td>



                            <td className="
                            text-center
                            ">

                                {product.stock}

                            </td>



                            <td className="
                            text-center
                            ">


                                <button

                                onClick={()=>setEditProduct(product)}

                                className="
                                text-blue-600
                                mr-4
                                "

                                >

                                Edit

                                </button>


                                <button
                                onClick={() => handleDelete(product.id, product.name)}
                                className="
                                text-red-600
                                "
                                >

                                    Delete

                                </button>


                            </td>


                        </tr>


                        ))

                    }


                    </tbody>


                    </table>


                </div>


            )}



        </div>


    </AdminLayout>

    );

}

}
export default ProductsManagement;