import React, { useState } from "react";
import "./LimitedEdition.css";

import { useDispatch, useSelector } from "react-redux";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import { Autoplay } from "swiper/modules";

import { Link } from "react-router-dom";

import StoreData from "@/Data/StoreData";

import { FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaCartPlus } from "react-icons/fa";

import toast from "react-hot-toast";

const LimitedEdition = () => {
  const dispatch = useDispatch();

  const [wishList, setWishList] = useState<any>({});

  const handleWishlistClick = (productID:any) => {
    setWishList((prevWishlist:any) => ({
      ...prevWishlist,
      [productID]: !prevWishlist[productID],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cartItems = useSelector((state:any) => state.cart.items);


  return (
    <>
      <div className="limitedProductSection">
        <h2>
          Shop By <span>Room</span>
        </h2>
        <div className="limitedProductSlider">
          <div className="swiper-button image-swiper-button-next">
            <IoIosArrowForward />
          </div>
          <div className="swiper-button image-swiper-button-prev">
            <IoIosArrowBack />
          </div>
          <Swiper
            slidesPerView={4}
            slidesPerGroup={4}
            spaceBetween={30}
            loop={true}
            navigation={{
              nextEl: ".image-swiper-button-next",
              prevEl: ".image-swiper-button-prev",
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            modules={[Navigation, Autoplay]}
            breakpoints={{
              320: {
                slidesPerView: 2,
                slidesPerGroup: 1,
                spaceBetween: 14,
              },
              768: {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                slidesPerGroup: 1,
                spaceBetween: 30,
              },
            }}
          >
            {StoreData.slice(8, 13).map((product) => {
              return (
                <SwiperSlide key={product.productID}>
                  <div className="lpContainer">
                    <div className="lpImageContainer">
                      <Link to="/Product" onClick={scrollToTop}>
                        <img
                          src={product.frontImg}
                          alt={product.productName}
                          className="lpImage"
                        />
                      </Link>
                      <h4 >
                        Add to Cart
                      </h4>
                    </div>
                    <div
                      className="lpProductImagesCart"
                   
                    >
                      <FaCartPlus />
                    </div>
                    <div className="limitedProductInfo">
                      <div className="lpCategoryWishlist">
                        <p>Dresses</p>
                        <FiHeart
                          onClick={() => handleWishlistClick(product.productID)}
                          style={{
                            color: wishList[product.productID]
                              ? "red"
                              : "#767676",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      <div className="productNameInfo">
                        <Link to="/Product" onClick={scrollToTop}>
                          <h5>{product.productName}</h5>
                        </Link>
                        <p>${product.productPrice}</p>
                        <div className="productRatingReviews">
                          <div className="productRatingStar">
                            <FaStar color="#FEC78A" size={10} />
                            <FaStar color="#FEC78A" size={10} />
                            <FaStar color="#FEC78A" size={10} />
                            <FaStar color="#FEC78A" size={10} />
                            <FaStar color="#FEC78A" size={10} />
                          </div>

                          <span>{product.productReviews}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default LimitedEdition;
