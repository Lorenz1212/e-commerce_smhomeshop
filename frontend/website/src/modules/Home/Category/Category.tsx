import React, { useState,useEffect } from "react";
import "./Category.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from 'react-router-dom'
import { Navigation } from "swiper/modules";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaEye } from "react-icons/fa6";
import { CategoryModel } from "@/Model/DataModel";
import { fetchCategory } from "@/services/HomeServices";

const Category = () => {
  const navigate = useNavigate();

  const [Categories, setCategories] = useState<CategoryModel[]>([]);

  useEffect(() => {
      fetchCategory().then(setCategories);
    }, []);

  const goToProductList = (category: string | number) => {
      scrollToTop()
      navigate(`/shop/${category}`);
  };
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="limitedProductSection">
        <h2>
          Shop By <span>Category</span>
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
            {Categories.slice(0, 13).map((category) => {
              return (
                <SwiperSlide key={category.id}>
                  <div className="lpContainer">
                    <div className="lpImageContainer">
                      <Link to={`/shop/${category.name.toLowerCase()}`} onClick={scrollToTop}>
                        <img
                          src={category.image_cover}
                          alt={category.name}
                          className="lpImage"
                        />
                      </Link>
                      <h4 onClick={() => goToProductList(category.name.toLowerCase())}>View Products</h4>
                    </div>
                    <Link
                      className="lpProductImagesCart"
                      to={`/shop/${category.name.toLowerCase()}`}
                    >
                      <FaEye/>
                    </Link>
                    <div className="limitedProductInfo">
                        <div className="productNameInfo">
                           <h5>{category.name}</h5>
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

export default Category;
