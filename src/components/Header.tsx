import React, { useEffect, useRef, useState } from 'react';
import logo_icon from '../components/img/logo_icon.svg';
import logo_dark_icon from '../components/img/logo_dark_icon.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLoginContext } from './LoginContext';
import { deleteLogin } from '../backend/api';
import success_icon from '../components/img/success_icon.svg';
import './../style/Muhammad_CSS/PageHeader.css';
import BuchungNewModal from './BuchungNewModal';
import { toast, ToastOptions } from 'react-toastify';
import { deleteCachedData } from '../dataLoader';

import moon_icon from './img/moon_icon.svg';
import sun_icon from './img/sun_icon.svg';
import bell_black_icon from "./img/bell_black_icon.svg";
import AlleMitteilungen from "./AlleMitteilungen";

interface ExtendedToastOptions extends ToastOptions {
    progressStyle?: React.CSSProperties;
}

function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const { loginInfo, setLoginInfo } = useLoginContext();
    const [resetForm, setResetForm] = useState(false);
    const [moonIcon, setMoonIcon] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const [showOverlay, setShowOverlay] = useState(false);

    const toggleOverlay = () => {
        setShowOverlay(!showOverlay);
    };

    const doLogout = async () => {
        await deleteLogin();
        setLoginInfo(false);
        localStorage.removeItem("loginInfo");
        localStorage.removeItem("cachedAlleBuchungen");
        localStorage.removeItem("cachedPocketsKategorienSparziele");
        deleteCachedData();
        navigate("/");
    };

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
        document.documentElement.classList.add("no-scroll");
    };

    const closeModal = () => {
        setIsOpen(false);
        setResetForm(true);
        document.documentElement.classList.remove("no-scroll");
        setTimeout(() => setResetForm(false), 0);
    };

    const switchIcon = () => {
        return moonIcon ? moon_icon : sun_icon;
    };

    const toggleIcon = () => {
        setMoonIcon(!moonIcon);
        document.body.classList.toggle("dark-mode");
    };

    const [isScrolled, setIsScrolled] = useState(false);

    const handleScroll = () => {
        const scrollTop = window.scrollY;
        setIsScrolled(scrollTop > 50);
        console.log(scrollTop);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`header ${isMenuOpen ? "header__top-open" : ""} ${isScrolled ? 'header--scrolled' : ''}`}>
            <div
                className={`header__top ${isOpen ? "buchung_open" : ""
                    }`}
            >
                <div className="container header__container">
                    <div className="header__top-nav">
                        <Link to={loginInfo ? "/dashboard" : "/"}>
                            {(() => {
                                if (moonIcon) {
                                    return (
                                        <img
                                            src={logo_icon}
                                            alt="Logo"
                                            className="header__top-nav-img"
                                        />
                                    );
                                } else {
                                    return (
                                        <img
                                            src={logo_dark_icon}
                                            alt="Logo"
                                            className="header__top-nav-img"
                                        />
                                    );
                                }
                            })()}
                        </Link>
                        <div className="desktopMenuWrapper">
                            <div className="mobileMenuWrapper">
                                {loginInfo && (
                                    <button className="buttonBuchungErstellen" onClick={openModal}>
                                        Neue Buchung +
                                    </button>
                                )}
                                <div className="header__nav-btn">
                                    <button className="nav-icon-btn" onClick={toggleMenu}>
                                        <div
                                            className={`nav-icon ${isMenuOpen ? "nav-icon--active" : ""
                                                }`}
                                        >
                                            <div className="nav-icon-bar"></div>
                                            <div className="nav-icon-bar"></div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <nav className={`nav ${isMenuOpen ? "header__top-nav--mobile" : ""}`}>
                                <ul className="nav__list">
                                    {loginInfo && (
                                        <li className="nav__item">
                                            <Link
                                                className={`nav__link ${location.pathname === "/dashboard"
                                                    ? "nav__link--active"
                                                    : ""
                                                    }`}
                                                to="/dashboard"
                                                onClick={closeMenu}
                                            >
                                                Dashboard
                                            </Link>
                                        </li>
                                    )}
                                    {loginInfo && (
                                        <li className="nav__item">
                                            <Link
                                                className={`nav__link ${location.pathname === "/analysen"
                                                    ? "nav__link--active"
                                                    : ""
                                                    }`}
                                                to="/analysen"
                                                onClick={closeMenu}
                                            >
                                                Analysen
                                            </Link>
                                        </li>
                                    )}
                                    {loginInfo && (
                                        <li className="nav__item">
                                            <Link
                                                className={`nav__link ${location.pathname === "/AlleBuchungen"
                                                    ? "nav__link--active"
                                                    : ""
                                                    }`}
                                                to="/AlleBuchungen"
                                                onClick={closeMenu}
                                            >
                                                Buchungen
                                            </Link>
                                        </li>
                                    )}
                                    {loginInfo && (
                                        <li className="nav__item">
                                            <Link
                                                className={`nav__link ${location.pathname === "/Profil"
                                                    ? "nav__link--active"
                                                    : ""
                                                    }`}
                                                to="/Profil"
                                                onClick={closeMenu}
                                            >
                                                Profil
                                            </Link>
                                        </li>
                                    )}

                                    {loginInfo && (
                                        <li className="nav__item">
                                            {
                                                <img
                                                    src={switchIcon()}
                                                    alt="Toggle Dark Mode"
                                                    onClick={toggleIcon}
                                                />
                                            }
                                        </li>
                                    )}
                                    {loginInfo && (
                                        <li className="nav__item">
                                        
                                            {
                                                <img
                                                    src={bell_black_icon}
                                                    alt="Mitteilungen"
                                                    onClick={toggleOverlay}
                                                />
                                            }
                                        </li>
                                    )}
                                    {!loginInfo && (
                                        <li className="nav__item">
                                            <Link
                                                className={`nav__link ${location.pathname === "/"
                                                    ? "nav__link--active"
                                                    : ""
                                                    }`}
                                                to="/"
                                                onClick={closeMenu}
                                            >
                                                Start
                                            </Link>
                                        </li>
                                    )}
                                    {!loginInfo && (
                                        <li className="nav__item">
                                            <Link
                                                className={`nav__link ${location.pathname === "/impressum"
                                                    ? "nav__link--active"
                                                    : ""
                                                    }`}
                                                to="/impressum"
                                                onClick={closeMenu}
                                            >
                                                Über uns
                                            </Link>
                                        </li>
                                    )}
                                    {!loginInfo && (
                                        <li className="nav__item">
                                            <Link
                                                className={`nav__link ${location.pathname === "/kontakt"
                                                    ? "nav__link--active"
                                                    : ""
                                                    }`}
                                                to="/kontakt"
                                                onClick={closeMenu}
                                            >
                                                Kontakte
                                            </Link>
                                        </li>
                                    )}

                                    {!loginInfo && (
                                        <>
                                            <li className="nav__item">
                                                <img
                                                    src={switchIcon()}
                                                    alt="Toggle Dark Mode"
                                                    onClick={toggleIcon}
                                                />
                                            </li>
                                        </>
                                    )}

                                    {loginInfo ? (
                                        <li className="nav__item logoutButton" onClick={doLogout}>
                                            <a className="nav__link">Logout →</a>
                                        </li>
                                    ) : (
                                        <li className="nav__item loginButton">
                                            <Link className="nav__link" to="/Login">
                                                Login →
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <BuchungNewModal
                isOpen={isOpen}
                onRequestClose={closeModal}
                onSuccess={closeModal}
                reset={resetForm}
            ></BuchungNewModal>
            {showOverlay && <AlleMitteilungen onClick={toggleOverlay} />}
        </header>
    );
}

export default Header;