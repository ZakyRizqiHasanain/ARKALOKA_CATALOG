import { Link } from "react-router-dom";

function ProductCard({product}){

return (

<div className="
rounded-2xl
border
p-4
hover:shadow-lg
transition
">


<div className="
h-48
bg-gray-100
rounded-xl
flex
items-center
justify-center
">

Image

</div>


<h3 className="
mt-4
font-semibold
">

{product.name}

</h3>


<p className="
text-gray-500
">

Rp {product.price}

</p>


<Link

to={`/product/${product.id || 1}`}

className="
mt-4
bg-blue-600
text-white
px-4
py-2
rounded-lg
inline-block
"

>

View Detail

</Link>


</div>

)

}


export default ProductCard;