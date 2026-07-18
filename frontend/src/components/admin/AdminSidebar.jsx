import { NavLink, useNavigate } from "react-router-dom";


function AdminSidebar(){


const navigate = useNavigate();



const logout = ()=>{

localStorage.removeItem("token");

navigate("/admin/login");

};



return (

<aside className="
w-64
bg-white
shadow
min-h-screen
p-6
">


<h1 className="
text-xl
font-bold
mb-8
">

Product Store Admin

</h1>



<nav className="
space-y-3
">


<NavLink to="/admin">

Dashboard

</NavLink>



<NavLink to="/admin/products">

Products

</NavLink>



<NavLink to="/admin/categories">

Categories

</NavLink>


<button

onClick={logout}

className="
block
text-red-500
mt-10
"

>

Logout

</button>



</nav>


</aside>

)


}


export default AdminSidebar;