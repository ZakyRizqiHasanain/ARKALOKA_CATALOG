import {
useEffect,
useState
} from "react";


import {
getCategories
}
from "../services/categoryService";


import {
createProduct
}
from "../services/productAdminService";



function AddProduct({
closeForm,
refreshProducts
}){


const [categories,setCategories]
=
useState([]);


const [form,setForm]
=
useState({

name:"",
slug:"",
description:"",
price:"",
stock:"",
category_id:""

});



const [loading,setLoading]
=
useState(false);



useEffect(()=>{

loadCategories();

},[]);



const loadCategories = async()=>{


try{


const data =
await getCategories();


setCategories(data);



}catch(error){

console.log(error);

}


};





const handleChange=(e)=>{


setForm({

...form,

[e.target.name]:
e.target.value

});


};





const handleSubmit=async(e)=>{


e.preventDefault();


try{


setLoading(true);



await createProduct(form);



alert(
"Produk berhasil ditambahkan"
);



refreshProducts();



closeForm();



}catch(error){


alert(error.message);


}finally{


setLoading(false);


}


};





return (

<div className="
bg-white
p-6
rounded-xl
shadow
mb-6
">


<h2 className="
text-2xl
font-bold
mb-6
">

Tambah Produk

</h2>



<form
onSubmit={handleSubmit}
className="
space-y-4
"
>



<input

name="name"

value={form.name}

onChange={handleChange}

placeholder="Nama Produk"

className="
border
p-3
w-full
rounded
"

/>



<input

name="slug"

value={form.slug}

onChange={handleChange}

placeholder="Slug Produk"

className="
border
p-3
w-full
rounded
"

/>



<textarea

name="description"

value={form.description}

onChange={handleChange}

placeholder="Deskripsi"

className="
border
p-3
w-full
rounded
"

/>




<input

type="number"

name="price"

value={form.price}

onChange={handleChange}

placeholder="Harga"

className="
border
p-3
w-full
rounded
"

/>



<input

type="number"

name="stock"

value={form.stock}

onChange={handleChange}

placeholder="Stock"

className="
border
p-3
w-full
rounded
"

/>





<select

name="category_id"

value={form.category_id}

onChange={handleChange}

className="
border
p-3
w-full
rounded
"

>


<option value="">

Pilih Kategori

</option>



{

categories.map(category=>(


<option

key={category.id}

value={category.id}

>

{category.name}

</option>


))

}


</select>





<div className="
flex
gap-3
">


<button

disabled={loading}

className="
bg-black
text-white
px-5
py-3
rounded
"

>


{
loading
?
"Menyimpan..."
:
"Simpan Produk"
}


</button>



<button

type="button"

onClick={closeForm}

className="
bg-gray-200
px-5
py-3
rounded
"

>

Batal

</button>



</div>



</form>


</div>

)


}


export default AddProduct;