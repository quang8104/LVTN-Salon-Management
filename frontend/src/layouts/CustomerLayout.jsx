import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CustomerLayout() {
    return (
        <>
            <Navbar />

            <main className="container mt-4">
                <Outlet />
            </main>

            <Footer />
        </>
    );
}

export default CustomerLayout;