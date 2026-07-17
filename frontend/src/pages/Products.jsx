import ProductCard from "../components/ProductCard";


function Products(){


const products=[

{
    id:1,
name:"Laptop ASUS",
price:"8000000"
},

{
    id:2,
name:"Smartphone",
price:"3000000"
},

{
    id:3,
name:"Headphone",
price:"500000"
},

{
    id:4,
name:"Keyboard Mechanical",
price:"700000"
}

];


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
mb-10
">

All Products

</h1>


<div className="
grid
md:grid-cols-4
gap-6
">


{

products.map((product,index)=>(

<ProductCard

key={index}

product={product}

/>

))

}


</div>


</section>

)


}


export default Products;