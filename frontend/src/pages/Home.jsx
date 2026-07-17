import Hero from "../components/Hero";
import CategoryCard from "../components/CategoryCard";
import ProductCard from "../components/ProductCard";


function Home(){


const categories=[

"Elektronik",

"Fashion",

"Rumah Tangga"

];


const products=[

{
id:1,
name:"Laptop ASUS",
price:"8000000"
},

{
id:2,
name:"Smartphone",
price:"3.000.000"
},

{
    id:3,
    name:"Headphone",
    price:"500.000"
}

];



return (

<>


<Hero />


<section className="
max-w-7xl
mx-auto
px-6
py-10
">


<h2 className="
text-3xl
font-bold
mb-8
">

Pilih Kategori

</h2>



<div className="
grid
md:grid-cols-3
gap-6
">


{
categories.map((item,index)=>(

<CategoryCard

key={index}

name={item}

/>

))

}


</div>


</section>





<section className="
max-w-7xl
mx-auto
px-6
py-10
">


<h2 className="
text-3xl
font-bold
mb-8
">

Produk Pilihan

</h2>


<div className="
grid
md:grid-cols-3
gap-6
">


{

products.map((item,index)=>(

<ProductCard

key={index}

product={item}

/>

))

}


</div>


</section>


</>

)


}


export default Home;