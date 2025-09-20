import React, {useEffect, useState} from 'react';
import AppNavbar from "./AppNavbar.jsx";

const MainLayout = (props) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    // Handle window resize for responsive sidebar
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
            if (window.innerWidth < 992) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    return (
           <div>
                {/* Navbar */}
                <AppNavbar/>

                {/* Main Content */}
                <div className="p-4"
                    style={{
                        marginTop: "56px",
                        marginLeft: sidebarOpen && !isMobile ? "220px" : "0px",
                        width: "100%",
                        transition: "0.3s",
                    }}>

                    {/*Main Content Area*/}
                    {props.children}


                </div>

            </div>

    );
};

export default MainLayout;