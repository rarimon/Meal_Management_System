import React, {useEffect, useState} from 'react';

const App = () => {
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
            <nav className="navbar navbar-dark bg-secondary fixed-top shadow-sm">
                <div className="container-fluid">
                    <button
                        className="btn btn-outline-light me-2"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <i className="bi bi-list"></i>
                    </button>
                    {/* Branch Name with Icon */}
                    <span className="navbar-brand d-flex align-items-center">
            <i className="bi bi-building me-2"></i> Main Branch
          </span>

                    {/* Search Box */}
                    <form className="d-none d-md-flex ms-auto me-3">
                        <input
                            className="form-control"
                            type="search"
                            placeholder="Search..."
                            aria-label="Search"
                        />
                    </form>

                    {/* Profile Dropdown */}
                    <div className="dropdown">
                        <button
                            className="btn btn-dark dropdown-toggle d-flex align-items-center"
                            type="button"
                            id="profileDropdown"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <img
                                src="https://via.placeholder.com/30"
                                alt="profile"
                                className="rounded-circle me-2"
                            />
                            Admin
                        </button>
                        <ul
                            className="dropdown-menu dropdown-menu-end"
                            aria-labelledby="profileDropdown"
                        >
                            <li>
                                <a className="dropdown-item" href="#">
                                    <i className="bi bi-person me-2"></i> Profile
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    <i className="bi bi-gear me-2"></i> Settings
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <a className="dropdown-item text-danger" href="#">
                                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="d-flex">
                {/* Sidebar */}
                <div
                    className="bg-secondary text-dark position-fixed pt-3 shadow-sm"
                    style={{
                        width: sidebarOpen ? "220px" : "0px",
                        top: "56px", // navbar height
                        left: "0",
                        height: "100%",
                        overflowX: "hidden",
                        transition: "0.3s",
                    }}
                >
                    <div className="px-3 mb-3 fw-bold d-flex align-items-center">
                        <i className="bi bi-speedometer2 me-2"></i> My Dashboard
                    </div>
                    <ul className="nav flex-column px-2">
                        <li className="nav-item">
                            <a className="nav-link text-dark d-flex align-items-center" href="#">
                                <i className="bi bi-house-door me-2"></i> Dashboard
                            </a>
                        </li>

                        {/* Multi dropdown menu */}
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link text-dark dropdown-toggle d-flex align-items-center"
                                href="#"
                                id="userMenu"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-people me-2"></i> Users
                            </a>
                            <ul className="dropdown-menu">
                                <li>
                                    <a className="dropdown-item" href="#">
                                        <i className="bi bi-list-ul me-2"></i> All Users
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        <i className="bi bi-person-plus me-2"></i> Add User
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        <i className="bi bi-shield-lock me-2"></i> Roles
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link text-dark d-flex align-items-center" href="#">
                                <i className="bi bi-bar-chart-line me-2"></i> Reports
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Main Content */}
                <div
                    className="p-4"
                    style={{
                        marginTop: "56px",
                        marginLeft: sidebarOpen && !isMobile ? "220px" : "0px",
                        width: "100%",
                        transition: "0.3s",
                    }}
                >
                    <h2>Welcome to Admin Dashboard</h2>
                    <p>
                        এখন Sidebar হালকা **gray** + শেডো এবং Navbar এও হালকা শেডো দেওয়া আছে।
                    </p>
                </div>
            </div>
        </div>
    );
};

export default App;