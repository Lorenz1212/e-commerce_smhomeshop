import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import "./Trendy.css";
import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { useAuth } from "@/modules/Authentication";
import { ModalResponse } from "@/utils/types";
import Popup from "@/components/ModalHandler/Popup";
import { ProductModel } from "@/Model/DataModel";
import { LoginModal } from "@/modules/Authentication/LoginSign/LoginModal";
import { FaEye } from "react-icons/fa6";
import { CurrencyText } from "@/components/inputmasks/CurrencyText";
import {   
  fetchAllProducts,
  fetchNewArrivals,
  fetchBestSellers
} from "@/services/HomeServices";

const Trendy: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2" | "tab3">("tab1");
  const [wishList, setWishList] = useState<Record<number, boolean>>({});
  const [allProducts, setAllProducts] = useState<ProductModel[]>([]);
  const [newArrivals, setNewArrivals] = useState<ProductModel[]>([]);
  const [bestSellers, setBestSellers] = useState<ProductModel[]>([]);

  const [modalState, setModalState] = useState<ModalResponse>({
    visible: false,
    title: '',
    body: <></>,
    className:'modal-xl',
    alignment:'centered'
  })

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    fetchAllProducts().then(setAllProducts);
    fetchNewArrivals().then(setNewArrivals);
    fetchBestSellers().then(setBestSellers);
  }, []);

  const goToProduct = (id: string | number) => {
      scrollToTop()
      navigate(`/product/${id}`);
  };

  const handleWishlistClick = (id: number) => {
    if (!currentUser || typeof currentUser == 'undefined') {
      setModalState({
        visible: true,
        title: 'Login',
        body: <LoginModal/>,
        className:'modal-xl',
        alignment:'centered'
      })
      return;
    }
    setWishList((prev) => ({ ...prev, [id]: !prev[id] }));
  }


  const renderProducts = (products: ProductModel[]) => (
    <div className="trendyMainContainer">
      {products.map((product,index) => (
        <div className="trendyProductContainer" key={index}>
          <div className="trendyProductImages">
            <Link to={`/product/${product.id_encrypted}`}>
              <img
                src={product.front_image || "/placeholder.jpg"}
                alt={product.name}
                className="trendyProduct_front"
              />
              <img
                src={product.back_image || "/placeholder.jpg"}
                alt={product.name}
                className="trendyProduct_back"
              />
            </Link>
            <h4 onClick={() => goToProduct(product.id_encrypted)}>View Details</h4>
          </div>
          <div
            className="trendyProductImagesCart"
            onClick={() => goToProduct(product.id_encrypted)}
          >
            <FaEye />
          </div>
          <div className="trendyProductInfo">
            <div className="trendyProductCategoryWishlist">
              <p>{product.category?.name ?? "Category"} ({product.brand?.name})</p>
              <FiHeart
                onClick={() => handleWishlistClick(product.id_encrypted)}
                style={{
                  color: wishList[product.id_encrypted] ? "red" : "#767676",
                  cursor: "pointer",
                }}
              />
            </div>
            <div className="trendyProductNameInfo">
              <h5>{product.name}</h5>
                <p>{
                product.variants_min_selling_price && product.variants_max_selling_price
                ? product.variants_min_selling_price === product.variants_max_selling_price
                  ? <CurrencyText value={product.variants_min_selling_price}/>
                  : <><CurrencyText value={product.variants_min_selling_price}/> - <CurrencyText value={product.variants_max_selling_price}/></>
                : <CurrencyText value={product.selling_price}/>
                }
              </p>
              {/* <div className="trendyProductRatingReviews">
                <div className="trendyProductRatingStar">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color="#FEC78A" size={10} />
                  ))}
                </div>
                <span>{product.reviews_count ?? "0 reviews"}</span>
              </div> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
    <div className="trendyProducts">
      <h2>
        Our Trendy <span>Products</span>
      </h2>
      <div className="trendyTabs">
        <div className="tabs">
          <p
            onClick={() => setActiveTab("tab1")}
            className={activeTab === "tab1" ? "active" : ""}
          >
            All
          </p>
          <p
            onClick={() => setActiveTab("tab2")}
            className={activeTab === "tab2" ? "active" : ""}
          >
            New Arrivals
          </p>
          <p
            onClick={() => setActiveTab("tab3")}
            className={activeTab === "tab3" ? "active" : ""}
          >
            Best Seller
          </p>
        </div>
        <div className="trendyTabContent">
          {activeTab === "tab1" && renderProducts(allProducts)}
          {activeTab === "tab2" && renderProducts(newArrivals)}
          {activeTab === "tab3" && renderProducts(bestSellers)}
        </div>
      </div>
      <div className="discoverMore">
          <Link to="/shop" onClick={scrollToTop}>
            <p>Discover More</p>
          </Link>
        </div>
    </div>
     {modalState.visible && (
          <Popup
            body={modalState.body}
            show={modalState.visible}
            onClose={() =>
              setModalState({
                visible: false,
                title: '',
                body: <></>,
                className: '',
                alignment: 'center',
              })
            }
          />
      )}
    </>
  );
};

export default Trendy;
