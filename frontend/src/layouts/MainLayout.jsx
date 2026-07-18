import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({ children }) {

    const location = useLocation();

    const isAdminPage = location.pathname.startsWith("/admin");

    return (
        <>
            {!isAdminPage && <Navbar />}

            <main>
                {children}
            </main>

            {!isAdminPage && <Footer />}
        </>
    );
}

export default MainLayout;