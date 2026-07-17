import { useParams } from "react-router-dom";


function Category(){


const {slug}=useParams();


return (

<section className="
max-w-7xl
mx-auto
px-6
py-16
">


<h1 className="
text-4xl
font-bold
">

Category:

{slug}

</h1>


<p className="
mt-4
text-gray-600
">

Menampilkan produk berdasarkan kategori.

</p>


</section>

)

}


export default Category;