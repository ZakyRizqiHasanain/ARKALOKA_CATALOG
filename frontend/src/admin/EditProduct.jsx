import {
useEffect,
useState
}
from "react";


import {
getCategories
}
from "../services/categoryService";


import {
updateProduct
}
from "../services/productAdminService";



function EditProduct({
product,
closeForm,
refreshProducts
}){


const [categories,setCategories]=useState([]);



const [form,setForm]=useState(product);



useEffect(()=>{

getCategories()
.then(setCategories);

},[]);



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


await updateProduct(
product.id,
form
);



alert(
"Produk berhasil diperbarui"
);



refreshProducts();

closeForm();



}catch(error){

alert(error.message);

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
mb-5
">

Edit Produk

</h2>



<form
onSubmit={handleSubmit}
className="space-y-4"
>


<input
name="name"
value={form.name}
onChange={handleChange}
className="border p-3 w-full"
/>



<input
name="slug"
value={form.slug}
onChange={handleChange}
className="border p-3 w-full"
/>



<textarea

name="description"

value={form.description}

onChange={handleChange}

className="border p-3 w-full"

/>



<input

name="price"

type="number"

value={form.price}

onChange={handleChange}

className="border p-3 w-full"

/>



<input

name="stock"

type="number"

value={form.stock}

onChange={handleChange}

className="border p-3 w-full"

/>



<select

name="category_id"

value={form.category_id}

onChange={handleChange}

className="border p-3 w-full"

>


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



<button

className="
bg-black
text-white
px-5
py-3
rounded
"

>

Update

</button>



</form>


</div>

)


}


export default EditProduct;