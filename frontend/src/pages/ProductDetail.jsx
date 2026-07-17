import { useParams } from "react-router-dom";


function ProductDetail(){


const {id}=useParams();


return (

<section className="
max-w-7xl
mx-auto
px-6
py-16
">


<div className="
grid
md:grid-cols-2
gap-10
">


<div className="
h-96
bg-gray-100
rounded-xl
flex
items-center
justify-center
">

Product Image

</div>



<div>


<h1 className="
text-4xl
font-bold
">

Product ID:

{id}

</h1>


<p className="
mt-5
text-gray-600
">

Product description here.

</p>


<button className="
mt-8
bg-blue-600
text-white
px-6
py-3
rounded-xl
">

Add To Cart

</button>


</div>


</div>


</section>

)


}


export default ProductDetail;