import React, { useEffect, useState } from "react";
import "./RelatedProducts.css";
import defaultImage from "@/assets/ProductDetail/default.jpg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";

import { useNavigate, useParams } from "react-router-dom";

import { FiHeart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ProductModel } from "@/Model/DataModel";
import { CurrencyText } from "@/components/inputmasks/CurrencyText";
import { ModalResponse } from "@/utils/types";
import { useAuth } from "@/modules/Authentication";
import { LoginModal } from "@/modules/Authentication/LoginSign/LoginModal";
import Popup from "@/components/ModalHandler/Popup";
import { useProduct } from "@/services/ProductServices";

const RelatedProducts = () => {

  const { id } = useParams<{ id: string }>();

  const { currentUser } = useAuth();

  const navigate = useNavigate();

  const { fetchProductRelated } = useProduct();

  const [modalState, setModalState] = useState<ModalResponse>({
    visible: false,
    title: "",
    body: <></>,
    className: "modal-xl",
    alignment: "centered",
  });
  
  const [products, setProducts] = useState<ProductModel[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetchProductRelated(id);
      if (res) setProducts(res);
    };
    load();
  }, []);

  const [wishList, setWishList] = useState<any>({});

  const handleWishlistClick = (productID: any) => {
      if (!currentUser) {
        setModalState({
          visible: true,
          title: "Login",
          body: <LoginModal />,
          className: "modal-xl",
          alignment: "centered",
        });
        return;
      }
      
      setWishList((prev: any) => ({
        ...prev,
        [productID]: !prev[productID],
      }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goToProduct = (id: string | number) => { 
    scrollToTop() 
    navigate(`/product/${id}`); 
  };

  return (
    <>
      <div className="relatedProductSection">
        <div className="relatedProducts">
          <h2>
            RELATED <span>PRODUCTS</span>
          </h2>
        </div>
        <div className="relatedProductSlider">
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
            modules={[Navigation]}
            breakpoints={{
              320: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 14,
              },
              768: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 30,
              },
            }}
          >
            {products.slice(0, 8).map((product:any) => {
              return (
                <SwiperSlide key={product.id_encrypted}>
                  <div className="rpContainer">
                    <div className="rpImages" onClick={scrollToTop}>
                      <img src={product.primary_image?.image_cover || defaultImage} alt="" />
                      <h4 onClick={() => goToProduct(product.id_encrypted)}>View Details</h4>
                    </div>

                    <div className="relatedProductInfo">
                      <div className="rpCategoryWishlist">
                        <p>{product.category?.name} ({product.brand?.name})</p>
                        <FiHeart
                          onClick={() => handleWishlistClick(product.id_encrypted)}
                          style={{
                            color: wishList[product.id_encrypted]
                              ? "red"
                              : "#767676",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                      <div className="productNameInfo">
                        <h5 onClick={scrollToTop}>{product.name}</h5>
                        <p>{
                        product.variants_min_selling_price && product.variants_max_selling_price
                        ? product.variants_min_selling_price === product.variants_max_selling_price
                          ? <CurrencyText value={product.variants_min_selling_price}/>
                          : <><CurrencyText value={product.variants_min_selling_price}/> - <CurrencyText value={product.variants_max_selling_price}/></>
                        : <CurrencyText value={product.selling_price}/>
                        }
                      </p>
                        {/* <div className="productRatingReviews">
                          <div className="productRatingStar">
                            <FaStar color="#FEC78A" size={10} />
                            <FaStar color="#FEC78A" size={10} />
                            <FaStar color="#FEC78A" size={10} />
                            <FaStar color="#FEC78A" size={10} />
                            <FaStar color="#FEC78A" size={10} />
                          </div>

                          <span>{product.productReviews}</span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
      {/* Modal */}
      {modalState.visible && (
        <Popup
          body={modalState.body}
          show={modalState.visible}
          onClose={() =>
            setModalState({
              visible: false,
              title: "",
              body: <></>,
              className: "",
              alignment: "center",
            })
          }
        />
      )}
    </>
  );
};

export default RelatedProducts;
