import { Link } from "react-router-dom";

function Navbar(){

    return (

        <nav className="
            w-full
            border-b
            bg-white
        ">

            <div className="
                max-w-7xl
                mx-auto
                px-6
                py-4
                flex
                items-center
                justify-between
            ">


                {/* Logo */}

                <div className="
                    text-2xl
                    font-bold
                    text-blue-600
                ">
                    ProductStore
                </div>


                {/* Desktop Menu */}

                <div className="
                hidden
                md:flex
                gap-8
                text-gray-700
                ">


                <Link to="/">
                Home
                </Link>


                <Link to="/products">
                Products
                </Link>


                <Link to="/category/electronics">
                Category
                </Link>


                <Link to="/about">
                About
                </Link>


                <Link to="/contact">
                Contact
                </Link>


                </div>


                {/* Search */}

                <div className="
                    hidden
                    md:block
                ">

                    <input

                    type="text"

                    placeholder="Search..."

                    className="
                        border
                        rounded-lg
                        px-4
                        py-2
                    "

                    />

                </div>


                {/* Mobile Button */}

                <button className="
                    md:hidden
                    text-2xl
                ">

                    ☰

                </button>


            </div>


        </nav>

    )

}


export default Navbar;