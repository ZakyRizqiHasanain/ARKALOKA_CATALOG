import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";


function AdminLayout({children}){


return (

<div className="
min-h-screen
flex
bg-gray-100
">


<AdminSidebar />


<div className="
flex-1
">


<AdminHeader />


<main className="
p-8
">

{children}

</main>


</div>


</div>

)


}


export default AdminLayout;