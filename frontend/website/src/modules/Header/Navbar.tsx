import React, { useState, useEffect } from "react";
import "./Navbar.css";

import { useSelector } from "react-redux";

import logo from "@/assets/logo.png";
import { Link } from "react-router-dom";

import { RiMenu2Line } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";
import { RiShoppingBagLine } from "react-icons/ri";
import { MdOutlineClose } from "react-icons/md";
import { FiHeart } from "react-icons/fi";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";

import Badge from "@mui/material/Badge";
import { useAuth } from "../Authentication";
import { useCart } from "@/services/CartService";

const Navbar = () => {
  const { currentUser } = useAuth()

  const controller = useCart();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [authPage, setAuthPage] = useState("");

  const cart = useSelector((state:any) => state.cart);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    document.body.style.overflow = mobileMenuOpen ? "auto" : "hidden";
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const page = (!currentUser || typeof currentUser == 'undefined')?`/login-signup?tab=login`:`/my_account`;
    setAuthPage(page);
    if(!currentUser || typeof currentUser == 'undefined'){
         controller.fetchCartCount()
    }
  }, [currentUser]);


  return (
    <>
      {/* Desktop Menu */}
      <nav className="navBar">
        <div className="logoLinkContainer">
          <div className="logoContainer">
            <Link to="/" onClick={scrollToTop}>
              <img src={logo} alt="Logo" />
            </Link>
          </div>
          <div className="linkContainer">
            <ul>
              <li>
                <Link to="/" onClick={scrollToTop}>
                  HOME
                </Link>
              </li>
              <li>
                <Link to="/shop/all" onClick={scrollToTop}>
                  SHOP
                </Link>
              </li>
              {/* <li>
                <Link to="/blog" onClick={scrollToTop}>
                  BLOG
                </Link>
              </li> */}
              {/* <li>
                <Link to="/about" onClick={scrollToTop}>
                  ABOUT
                </Link>
              </li> */}
              <li>
                <Link to="/contact" onClick={scrollToTop}>
                  CONTACT
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="iconContainer">
          {/* <FiSearch size={22} onClick={scrollToTop} /> */}
          {
            !currentUser || typeof currentUser == 'undefined' ? (
              <>
                 <Link to={authPage} onClick={scrollToTop}>
                  <FaRegUser size={22} />
                </Link>
              </>
            ):(
              <>
                <Link to="/cart" onClick={scrollToTop}>
                  <Badge
                    badgeContent={cart.count === 0 ? "0" : cart.count}
                    color="primary"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                  >
                  <RiShoppingBagLine size={22} />
                  </Badge>
              </Link>
                <FiHeart size={22} onClick={scrollToTop} />
               <FaRegUser size={22}  className={`cursor-pointer`} onClick={() => setDropdownOpen(!dropdownOpen)}/>
                <div 
                  className={`accountDropdown`} 
                >
                  <div className={`accountDropdownMenu ${dropdownOpen ? "open" : ""}`}  onMouseLeave={() => setDropdownOpen(false)}>
                    <Link to="/my_account/profile">My Profile</Link>
                    <Link to="/my_account/orders">My Orders</Link>
                    <Link to="/my_account/payments">Payment History</Link>
                     <Link to="/logout">Logout</Link>
                  </div>
              </div>
              </>
            )
          }
          
          {/* <RiMenu2Line size={22} /> */}
        </div>
      </nav>

      {/* Mobile Menu */}
      <nav>
        <div className="mobile-nav">
          {mobileMenuOpen ? (
            <MdOutlineClose size={22} onClick={toggleMobileMenu} />
          ) : (
            <RiMenu2Line size={22} onClick={toggleMobileMenu} />
          )}
          <div className="logoContainer">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>
          <Link to="/cart">
            <Badge
              badgeContent={cart.items.length === 0 ? "0" : cart.items.length}
              color="primary"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <RiShoppingBagLine size={22} color="black" />
            </Badge>
          </Link>
        </div>
        <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
          <div className="mobile-menuTop">
            <div className="mobile-menuSearchBar">
              <div className="mobile-menuSearchBarContainer">
                <input type="text" placeholder="Search products" />
                <Link to="/shop/all">
                  <FiSearch size={22} onClick={toggleMobileMenu} />
                </Link>
              </div>
            </div>
            <div className="mobile-menuList">
              <ul>
                <li>
                  <Link to="/" onClick={toggleMobileMenu}>
                    HOME
                  </Link>
                </li>
                <li>
                  <Link to="/shop/all" onClick={toggleMobileMenu}>
                    SHOP
                  </Link>
                </li>
                {/* <li>
                  <Link to="/blog" onClick={toggleMobileMenu}>
                    BLOG
                  </Link>
                </li> */}
                {/* <li>
                  <Link to="/about" onClick={toggleMobileMenu}>
                    ABOUT
                  </Link>
                </li> */}
                <li>
                  <Link to="/contact" onClick={toggleMobileMenu}>
                    CONTACT
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mobile-menuFooter">
            <div className="mobile-menuFooterLogin">
                {
                  !currentUser || typeof currentUser == 'undefined' ? (
                    <>
                      <Link to={authPage} onClick={scrollToTop}>
                        <FaRegUser size={22} />
                      </Link>
                    </>
                  ):(
                    <>
                      <Link to="/cart" onClick={scrollToTop}>
                        <Badge
                          badgeContent={cart.count === 0 ? "0" : cart.count}
                          color="primary"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                        >
                        <RiShoppingBagLine size={22} />
                        </Badge>
                    </Link>
                      <FiHeart size={22} onClick={scrollToTop} />
                    <FaRegUser size={22}  className={`cursor-pointer`} onClick={() => setDropdownOpen(!dropdownOpen)}/>
                      <div 
                        className={`accountDropdown`} 
                      >
                        <div className={`accountDropdownMenu ${dropdownOpen ? "open" : ""}`}  onMouseLeave={() => setDropdownOpen(false)}>
                          <Link to="/my_account/profile">My Profile</Link>
                          <Link to="/my_account/orders">My Orders</Link>
                          <Link to="/my_account/payments">Payment History</Link>
                          <Link to="/logout">Logout</Link>
                        </div>
                    </div>
                    </>
                  )
                }
            </div>
            <div className="mobile-menuFooterLangCurrency">
              {/* <div className="mobile-menuFooterLang">
                <p>Language</p>
                <select name="language" id="language">
                  <option value="english">United States | English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Germany">Germany</option>
                  <option value="French">French</option>
                </select>
              </div> */}
              {/* <div className="mobile-menuFooterCurrency">
                <p>Currency</p>
                <select name="currency" id="currency">
                  <option value="USD">$ USD</option>
                  <option value="INR">₹ INR</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
              </div> */}
            </div>
            <div className="mobile-menuSocial_links">
              <FaFacebookF />
              <FaXTwitter />
              <FaInstagram />
              <FaYoutube />
              <FaPinterest />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
