import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Modal from "@mui/material/Modal";
import "./Product.css";
import { useDispatch } from "react-redux";
import Popup from "@/components/ModalHandler/Popup";
import defaultImage from "@/assets/ProductDetail/default.jpg";
import { GoChevronLeft } from "react-icons/go";
import { GoChevronRight } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { PiShareNetworkLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@/modules/Authentication";
import { ModalResponse } from "@/utils/types";
import { LoginModal } from "@/modules/Authentication/LoginSign/LoginModal";

import { ProductModel } from "@/Model/DataModel";
import { CurrencyText } from "@/components/inputmasks/CurrencyText";
import AdditionalInfo from "../AdditonInfo/AdditionalInfo";
import RelatedProducts from "../RelatedProducts/RelatedProducts";
import { useProduct } from "@/services/ProductServices";
import { useCart } from "@/services/CartService";

const Product = () => {
  const { currentUser } = useAuth()

  const { id } = useParams<{ id: string }>();

  const { storeProductCart } = useCart();

  const { fetchProductDetails } = useProduct();

  const [product, setProduct] = useState<ProductModel>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [clicked, setClicked] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [modalState, setModalState] = useState<ModalResponse>({
    visible: false,
    title: '',
    body: <></>,
    className:'modal-xl',
    alignment:'centered'
  })

  const handleOpenModal = (img: string) => {
    setSelectedImage(img);
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetchProductDetails(id);
      if (res) setProduct(res);
    };
    load();
  }, [id]);

  useEffect(() => {
    // auto-add freebies
    if (product?.product_addons) {
      const freebies = product.product_addons
        .filter((a: any) => a.addon.is_freebies === "Y")
        .map((a: any) => a.id_encrypted);
      setSelectedAddons(freebies);
    }
  }, [product]);

  const handleAddonToggle = (addonId: string, addon: any) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  const [currentImg, setCurrentImg] = useState(0);

  const [quantity, setQuantity] = useState(1);

  const increment = () => {
    setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleInputChange = (event:any) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  // Product WishList
  const handleWishClick = () => {
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

    setClicked(!clicked);
  };

  const [selectSize, setSelectSize] = useState("S");

  const dispatch = useDispatch();

  const handleAddToCart = async  () => {
    if (!currentUser || typeof currentUser == 'undefined') {
      setModalState({
        visible: true,
        title: 'Login',
        body: <LoginModal />,
        className: 'modal-xl',
        alignment: 'centered',
      });
      return;
    }

    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      toast.error("Please select a variant first!", {
        duration: 2000,
        style: { backgroundColor: "#ff4b4b", color: "white" },
      });
      return;
    }

    let productPrice = product?.selling_price || 0;

    if (selectedVariant) {
      productPrice = selectedVariant.selling_price;
    } else if (
      product?.variants_min_selling_price &&
      product?.variants_max_selling_price &&
      product.variants_min_selling_price !== product.variants_max_selling_price
    ) {
      productPrice = product.variants_min_selling_price;
    }

    const stock = selectedVariant
      ? selectedVariant.quantity_on_hand
      : product?.quantity_on_hand || 0;

    if (!stock || stock <= 0) {
      toast.error("Out of stock", {
        duration: 2000,
        style: { backgroundColor: "#ff4b4b", color: "white" },
      });
      return;
    }

    if (quantity > stock) {
      toast.error(`Only ${stock} items available in stock`, {
        duration: 2000,
        style: { backgroundColor: "#ff4b4b", color: "white" },
      });
      return;
    }

    const selectedAddonDetails = product?.product_addons
      ?.filter((addonItem: any) =>
        selectedAddons.includes(addonItem.id_encrypted)
      )
      .map((addonItem: any) => ({
        addon_id: addonItem.addon.id_encrypted
      }));

    const addonSignature = selectedAddonDetails
      ?.filter((a:any) => !a.is_freebie)
      .map((a:any) => a.addon_id)
      .sort()
      .join(",");


    const productDetails = {
      product_id: product?.id_encrypted,
      variant_id: selectedVariant ? selectedVariant.id_encrypted : null,
      quantity: quantity,
      addons: selectedAddonDetails,
      addon_signature: addonSignature,
    };
    
    await storeProductCart(productDetails);
  };

  return (
    <>
      <div className="productSection">
        <div className="productShowCase">
          <div className="productGallery">
            <div className="productThumb">
              {product?.images && product.images.length > 0 ? (
                  product.images.map((item: any, index: number) => (
                    <img
                      src={item.image_cover || defaultImage}
                      key={index}
                      onClick={() => setCurrentImg(index)}
                      alt={`thumb-${index}`}
                    />
                  ))
                ) : (
                  <img src={defaultImage} alt="default-thumb" />
                )}
            </div>
            <div className="productFullImg">
                {product?.images && product.images.length > 0 ? (
                  <img
                    src={product.images[currentImg]?.image_cover || defaultImage}
                    alt={`product-${currentImg}`}
                  />
                ) : (
                  <img src={defaultImage} alt="default-product" />
                )}
              <div className="buttonsGroup">
                {product?.images && product.images.length > 1 && (
                    <div className="buttonsGroup">
                      <button
                        onClick={() =>
                          setCurrentImg(
                            currentImg === 0 ? product.images.length - 1 : currentImg - 1
                          )
                        }
                        className="directionBtn"
                      >
                        <GoChevronLeft size={18} />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImg(
                            currentImg === product.images.length - 1 ? 0 : currentImg + 1
                          )
                        }
                        className="directionBtn"
                      >
                        <GoChevronRight size={18} />
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="productDetails">
            <div className="productBreadcrumb">
              <div className="breadcrumbLink">
                <Link to="/">Home</Link>&nbsp;/&nbsp;
                <Link to="/shop/all ">The Shop</Link>
              </div>
              {/* <div className="prevNextLink">
                <Link to="/product">
                  <GoChevronLeft />
                  <p>Prev</p>
                </Link>
                <Link to="/product">
                  <p>Next</p>
                  <GoChevronRight />
                </Link>
              </div> */}
            </div>
            <div className="productName">
              <h1>{product?.name}</h1>
            </div>
            {/* <div className="productRating">
              <FaStar color="#FEC78A" size={10} />
              <FaStar color="#FEC78A" size={10} />
              <FaStar color="#FEC78A" size={10} />
              <FaStar color="#FEC78A" size={10} />
              <FaStar color="#FEC78A" size={10} />
              <p>8k+ reviews</p>
            </div> */}
            <div className="productPrice">
              <h4>
                {
                product?.variants_min_selling_price && product.variants_max_selling_price
                ? product?.variants_min_selling_price === product.variants_max_selling_price
                  ? <CurrencyText value={product.variants_min_selling_price}/>
                  : 
                  !selectedVariant ? 
                     <>
                      <CurrencyText value={product.variants_min_selling_price}/> - <CurrencyText value={product.variants_max_selling_price}/>
                    </>
                  : 
                  <>
                    <CurrencyText value={selectedVariant.selling_price}/>
                  </>
                : <CurrencyText value={product?.selling_price}/>
                }
              </h4>
            </div>
           {product?.variants && product.variants.length > 0 ? (
            <div className="productStocks">
              <h5>
                Stocks :{" "}
                {selectedVariant
                  ? selectedVariant.quantity_on_hand
                  : "Select a variant"}
              </h5>
            </div>
          ) : (
            <div className="productStocks">
              <h5>Stocks : {product?.quantity_on_hand}</h5>
            </div>
          )}
            <div className="productDescription">  
              <p>{product?.description}
              </p>
            </div>
            {
              product?.variants && product.variants.length > 0 && (
              <div className="productVariants">
                <h4>Variants</h4>
                <div className="variantImages">
                  {product?.variants.map((variant:any, index:number) => (
                    <Tooltip
                      key={variant.id_encrypted}
                      title={
                        <div style={{ textAlign: "center" }}>
                          <div>{variant.variant_name }</div>
                          <button 
                          className="viewImageBtn"
                          onClick={() => {
                            handleOpenModal(variant.image_cover || defaultImage);
                          }}
                          >View Image</button>
                        </div>
                      }
                      placement="top"
                      TransitionComponent={Zoom}
                      enterTouchDelay={0}
                      arrow
                    >
                      <img
                        src={variant.image_cover || defaultImage}
                        alt={variant.variant_name}
                        className={`variantThumb ${selectSize === variant.id_encrypted ? "active" : ""}`}
                        onClick={() => {
                          setSelectSize(variant.id_encrypted);
                          setSelectedVariant(variant);  
                        }}
                      />
                    </Tooltip>
                  ))}
                </div>
              </div>
              )
            }
          {
            product?.product_addons && product.product_addons.length > 0 && (
              <div className="productAddons">
                <h4>Available Add-ons</h4>
                <div className="addonsList scrollable">
                  {product.product_addons
                    // 🔹 Sort muna dito
                    .slice() // para di ma-mutate yung original array
                    .sort((a: any, b: any) => {
                      const aFreebie = a.addon.is_freebies === "Y" ? 0 : 1;
                      const bFreebie = b.addon.is_freebies === "Y" ? 0 : 1;
                      if (aFreebie !== bFreebie) return aFreebie - bFreebie; // freebies first
                      return a.addon.name.localeCompare(b.addon.name); // then sort by name
                    }).map((addonItem: any) => {
                    const addon = addonItem.addon;
                    const isFreebie = addon.is_freebies === "Y";
                    return (
                      <div key={addon.id_encrypted} className="addonItem">
                        <label>
                          {isFreebie ? (
                            <input type="checkbox" checked disabled />
                          ) : (
                            <input
                              type="checkbox"
                              className="addonsRadio"
                              checked={selectedAddons.includes(addonItem.id_encrypted)}
                              onChange={() => handleAddonToggle(addonItem.id_encrypted, addon)}
                            />
                          )}
                          <span className="addonName">{addon.name} </span>
                        </label>
                        <span className="addonPrice">
                          {isFreebie ? "(Included)" : <CurrencyText value={addonItem.custom_price || addon.base_price} />}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          }
                  
            {/* <div className="productSizeColor">
              <div className="productSize">
                <p>Variants</p>
                <div className="sizeBtn">
                  {sizes.map((size, index) => (
                    <Tooltip
                      key={size}
                      title={sizesFullName[index]}
                      placement="top"
                      TransitionComponent={Zoom}
                      enterTouchDelay={0}
                      arrow
                    >
                      <button
                        style={{
                          borderColor: selectSize === size ? "#000" : "#e0e0e0",
                        }}
                        onClick={() => setSelectSize(size)}
                      >
                        {size}
                      </button>
                    </Tooltip>
                  ))}
                </div>
              </div>
              <div className="productColor">
                <p>Color</p>
                <div className="colorBtn">
                  {colors.map((color, index) => (
                    <Tooltip
                      key={color}
                      title={colorsName[index]}
                      placement="top"
                      enterTouchDelay={0}
                      TransitionComponent={Zoom}
                      arrow
                    >
                      <button
                        className={
                          highlightedColor === color ? "highlighted" : ""
                        }
                        style={{
                          backgroundColor: color.toLowerCase(),
                          border:
                            highlightedColor === color
                              ? "0px solid #000"
                              : "0px solid white",
                          padding: "8px",
                          margin: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => setHighlightedColor(color)}
                      />
                    </Tooltip>
                  ))}
                </div>
              </div>
            </div> */}
            <div className="productCartQuantity">
              <div className="productQuantity">
                <button onClick={decrement}>-</button>
                <input
                  type="text"
                  value={quantity}
                  onChange={handleInputChange}
                />
                <button onClick={increment}>+</button>
              </div>
              <div className="productCartBtn">
                <button onClick={handleAddToCart}>Add to Cart</button>
              </div>
            </div>
            <div className="productWishShare">
              <div className="productWishList">
                <button onClick={handleWishClick}>
                  <FiHeart color={clicked ? "red" : ""} size={17} />
                  <p>Add to Wishlist</p>
                </button>
              </div>
              <div className="productShare">
                <PiShareNetworkLight size={22} />
                <p>Share</p>
              </div>
            </div>
            <div className="productTags">
              <p>
                <span>SKU: </span>{product?.sku}
              </p>
              <p>
                <span>CATEGORY: </span>{product?.category?.name}
              </p>
              <p>
                <span>BRAND: </span>{product?.brand?.name}
              </p>
            </div>
          </div>
        </div>
      </div>
      <AdditionalInfo description={product?.long_description}/>
      <RelatedProducts/>
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
      <Modal open={openModal} onClose={handleCloseModal}>
        <div className="variantModal">
          {selectedImage && <img src={selectedImage} alt="Variant preview" />}
        </div>
      </Modal>
    </>
  );
};

export default Product;
