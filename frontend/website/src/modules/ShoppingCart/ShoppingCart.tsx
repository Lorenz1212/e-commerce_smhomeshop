import React, { useEffect, useRef, useState } from "react";
import "./ShoppingCart.css";
import { useSelector, useDispatch } from "react-redux";
import { Formik, FormikProps, FormikValues } from 'formik'
import * as Yup from 'yup'
import clsx from "clsx";
import Swal from 'sweetalert2'
import defaultImage from "@/assets/ProductDetail/default.jpg";
import { MdOutlineClose } from "react-icons/md";
import { Link } from "react-router-dom";
import success from "../../Assets/success.png";
import { useCart } from "@/services/CartService";
import { CurrencyText } from "@/components/inputmasks/CurrencyText";
import { ModalResponse } from "@/utils/types";
import Popup from "@/components/ModalHandler/Popup";
import { AddressModal } from "./components/modals/AddressModal";
import RegionSelect from "@/components/Address/RegionSelect";
import ProvinceSelect from "@/components/Address/ProvinceSelect";
import CitySelect from "@/components/Address/CitySelect";
import BrgySelect from "@/components/Address/BarangaySelect";
import debounce from "lodash.debounce";

const ShoppingCart = () => {

  const controller = useCart();

  const [modalState, setModalState] = useState<ModalResponse>({
    visible: false,
    title: '',
    body: <></>,
    className:'modal-xl',
    alignment:'centered'
  })

  const [showAddressModal, setShowAddressModal] = useState(false);

  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [vat, setVat] = useState(0);
  const [total, setTotal] = useState(0);

  const [productCarts, setProductCarts] = useState<any>([]);

  const [address, onSetAddress] = useState<any>([]);

  const loadProductCart = async () => {
    const res = await controller.fetchCarts();
      if (res) {
        setProductCarts(res);
      }
  };

  const calculateTotals = (carts: any) => {
    const VAT_RATE = 0.12;

    const sub = carts.reduce((acc: number, item: any) => {
      // total ng addons per product
      const addonsTotal = item.addons?.reduce(
        (addonAcc: number, addon: any) => addonAcc + parseFloat(addon.price || 0),
        0
      ) || 0;

      // price ng product + addons
      const itemTotal = (parseFloat(item.selling_price) + parseFloat(addonsTotal)) * item.quantity;

      return acc + itemTotal;
    }, 0);

    const ship = sub === 0 ? 0 : 5;
    const v = sub * VAT_RATE;
    const t = sub + v;

    setSubtotal(sub);
    setShipping(ship);
    setVat(v);
    setTotal(t);
  };

  useEffect(() => {
    if(!showAddressModal){
      setModalState(prev => ({ ...prev, visible: false }));
    }
  }, [showAddressModal]);

  useEffect(() => {
    loadProductCart();
  }, []);

  
  useEffect(() => {
    calculateTotals(productCarts);
  }, [productCarts]);

  useEffect(() => {
    if (address && Object.keys(address).length > 0 && formikRef.current) {
      formikRef.current.setValues({
        company_name: address.company_name || '',
        address: address.address || '',
        region_code: address.region_code || '',
        province_code: address.province_code || '',
        city_code: address.city_code || '',
        brgy_code: address.brgy_code || '',
        postal_code: address.postal_code || '',
      });
    }
  }, [address]);

  const cartItems = useSelector((state:any) => state.cart.items);

  const [activeTab, setActiveTab] = useState("cartTab1");

  const [payments, setPayments] = useState(false);

  const handleTabClick = (tab:any) => {
    if (tab === "cartTab1" || productCarts.length > 0) {
      setActiveTab(tab);
    }
  };

  const handleQuantityChange = (cart_id:any, quantity:any) => {
    if (quantity >= 1 && quantity <= 20) {
      const updatedCart = productCarts.map((item:any) =>
        item?.id === cart_id ? { ...item, quantity } : item
      );

      setProductCarts(updatedCart);
      calculateTotals(updatedCart);

      debouncedUpdateQuantity(cart_id, quantity);
    }
  };

  const debouncedUpdateQuantity = useRef(
    debounce((cart_id: any, quantity: any) => {
      controller.updateProductCartQuantity(cart_id, quantity);
    }, 800)
  ).current;

  const handleRemoveItem = (cart_id:any) => {
    const updatedCart = productCarts.filter((item:any) => item.id !== cart_id);
    setProductCarts(updatedCart);
    calculateTotals(updatedCart);

    debouncedRemoveProduct(cart_id);
  };

  const debouncedRemoveProduct = useRef(
    debounce((cart_id: string) => {
      controller.removeProductCart(cart_id);
    }, 500)
  ).current;


  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // current Date
  const currentDate = new Date();

  const formatDate = (date:any) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Random number
  const orderNumber = Math.floor(Math.random() * 100000);

  // Radio Button Data
  const [selectedPayment, setSelectedPayment] = useState("COD");

  const handlePaymentChange = (e:any) => {
    setSelectedPayment(e.target.value);
  };

   const handleShowAddress = () => {
      setModalState({
        visible: true,
        title: "Choose your address",
        body: <AddressModal onSetAddress={onSetAddress} setShowAddressModal={setShowAddressModal} />,
        className: "modal-xl",
        alignment: "centered",
      });
      return;
  };

  const Schema = Yup.object().shape({
    region_code: Yup.string().required('Region is required'),
    province_code: Yup.string().required('Province is required'),
    city_code: Yup.string().required('City is required'),
    brgy_code: Yup.string().required('Barangay is required'),
    postal_code: Yup.string().required('Postal/Zip Code is required'),
  })


  return (
    <>
      <div className="shoppingCartSection">
        <h2>Cart</h2>

        <div className="shoppingCartTabsContainer">
          <div className={`shoppingCartTabs ${activeTab}`}>
            <button
              className={activeTab === "cartTab1" ? "active" : ""}
              onClick={() => {
                handleTabClick("cartTab1");
                setPayments(false);
              }}
            >
              <div className="shoppingCartTabsNumber">
                <h3>01</h3>
                <div className="shoppingCartTabsHeading">
                  <h3>Shopping Bag</h3>
                  <p>Manage Your Items List</p>
                </div>
              </div>
            </button>
            <button
              className={activeTab === "cartTab2" ? "active" : ""}
              onClick={() => {
                handleTabClick("cartTab2");
                setPayments(false);
              }}
              disabled={productCarts.length === 0}
            >
              <div className="shoppingCartTabsNumber">
                <h3>02</h3>
                <div className="shoppingCartTabsHeading">
                  <h3>Shipping and Checkout</h3>
                  <p>Checkout Your Items List</p>
                </div>
              </div>
            </button>
            <button
              className={activeTab === "cartTab3" ? "active" : ""}
              onClick={() => {
                handleTabClick("cartTab3");
              }}
              disabled={productCarts.length === 0 || payments === false}
            >
              <div className="shoppingCartTabsNumber">
                <h3>03</h3>
                <div className="shoppingCartTabsHeading">
                  <h3>Confirmation</h3>
                  <p>Review And Submit Your Order</p>
                </div>
              </div>
            </button>
          </div>
          <div className="shoppingCartTabsContent">
            {/* tab1 */}
            {activeTab === "cartTab1" && (
              <div className="shoppingBagSection">
                <div className="shoppingBagTableSection">
                  {/* For Desktop Devices */}
                  <div className="shoppingBagTableWrapper">
                      <table className="shoppingBagTable">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th></th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th></th>
                          </tr>
                        </thead>
                      <tbody>
                          {productCarts.length > 0 ? (
                            productCarts.map((item: any) => {

                              const variantName = item.variant?.name
                                ? ` - ${item.variant.name}`
                                : "";

                              const addonsTotal = item.addons?.reduce(
                                (acc: number, addon: any) => acc + parseFloat(addon.price || 0),
                                0
                              );
                              
                              const itemPrice = (parseFloat(item.selling_price)  + parseFloat(addonsTotal));

                              return (
                               <tr key={`tab1-${item.id}`}>
                                  <td data-label="Product">
                                    <div className="shoppingBagTableImg">
                                      <Link to={`/product/${item.product_id}`} onClick={scrollToTop}>
                                        <img src={item.image_url || defaultImage} alt="" />
                                      </Link>
                                    </div>
                                  </td>
                                  <td data-label="">
                                    <div className="shoppingBagTableProductDetail">
                                      <Link to={`/product/${item.product_id}`} onClick={scrollToTop}>
                                        <h4>{item.product_name} {variantName} (<CurrencyText value={item.selling_price} />)</h4>
                                          {
                                              item.addons.length > 0 && (
                                          
                                                item.addons.map((addon: any,index:number) => {
                                                    return (
                                                      <React.Fragment key={`addons-${index}`}>
                                                        <small>
                                                          - {addon.name}  {
                                                            addon.is_freebie == 'Y'? `` : <CurrencyText value={addon.price} />
                                                          }
                                                        </small>
                                                         <br />
                                                      </React.Fragment>
                                                    )
                                                })
                                              )
                                          }
                                      </Link>
                                      {/* <p>{item.productReviews}</p> */}
                                    </div>
                                  </td>
                                  <td
                                    data-label="Price"
                                    style={{ textAlign: "center" }}
                                  >
                                    <CurrencyText value={itemPrice}/>
                                  </td>
                                  <td data-label="Quantity">
                                    <div className="ShoppingBagTableQuantity">
                                      <button
                                        onClick={() =>
                                          handleQuantityChange(
                                            item.id,
                                            item.quantity - 1
                                          )
                                        }
                                      >
                                        -
                                      </button>
                                      <input
                                        type="text"
                                        min="1"
                                        max="20"
                                        value={item.quantity}
                                        onChange={(e) =>
                                          handleQuantityChange(
                                            item.id,
                                            parseInt(e.target.value)
                                          )
                                        }
                                      />
                                      <button
                                        className="cursor-pointer"
                                        onClick={() =>
                                          handleQuantityChange(
                                            item.id,
                                            item.quantity + 1
                                          )
                                        }
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>
                                  <td data-label="Subtotal">
                                    <p
                                      style={{
                                        textAlign: "center",
                                        fontWeight: "500",
                                      }}
                                    >
                                      <CurrencyText value={(item.quantity * itemPrice)}/>
                                    </p>
                                  </td>
                                  <td data-label="">
                                    <MdOutlineClose
                                      className="cursor-pointer"
                                      onClick={() =>
                                        handleRemoveItem(item.id)
                                      }
                                    />
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                              <tr>
                                <td colSpan={6}>
                                  <div className="shoppingCartEmpty">
                                    <span>Your cart is empty!</span>
                                    <Link to="/shop/all" onClick={scrollToTop}>
                                      <button>Shop Now</button>
                                    </Link>
                                  </div>
                                </td>
                              </tr>
                            )
                        }
                    </tbody>
                      {/* <tfoot>
                        <tr>
                          <td
                            colSpan={6}
                            className="shopCartFooter"
                            style={{
                              borderBottom: "none",
                              padding: "20px 0px",
                            }}
                          >
                            {productCarts.length > 0 && (
                              <div className="shopCartFooterContainer">
                                <form>
                                  <input type="text" placeholder="Coupon Code" />
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                    }}
                                  >
                                    Apply Coupon
                                  </button>
                                </form>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                  className="shopCartFooterbutton"
                                >
                                  Update Cart
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      </tfoot> */}
                      </table>
                  </div>
                  {/* For Mobile devices */}

                  <div className="shoppingBagTableMobile">
                    {productCarts.length > 0 ? (
                      <>
                        {
                          productCarts.map((item:any) => {
                           const variantName = item.variant?.name
                              ? ` - ${item.variant.name}`
                              : "";

                            const addonsTotal = item.addons?.reduce(
                              (acc: number, addon: any) => acc + parseFloat(addon.price || 0),
                              0
                            );
                              
                            const itemPrice = (parseFloat(item.selling_price)  + parseFloat(addonsTotal));
                            
                            return (
                              <div key={`mobile-${item.id}`}>
                                <div className="shoppingBagTableMobileItems">
                                  <div className="shoppingBagTableMobileItemsImg">
                                    <Link to={`/product/${item.product_id}`} onClick={scrollToTop}>
                                      <img src={item.image_url || defaultImage} alt="" />
                                    </Link>
                                  </div>
                                  <div className="shoppingBagTableMobileItemsDetail">
                                    <div className="shoppingBagTableMobileItemsDetailMain">
                                      <Link to="/product" onClick={scrollToTop}>
                                        <h4>{item.product_name} {variantName}</h4>
                                          {
                                              item.addons.length > 0 && (
                                          
                                                item.addons.map((addon: any,index:number) => {
                                                    return (
                                                     <React.Fragment key={`addons-${index}`}>
                                                        <small>
                                                          - {addon.name}  {
                                                            addon.is_freebie == 'Y'? `` : <CurrencyText value={addon.price} />
                                                          }
                                                        </small>
                                                         <br />
                                                      </React.Fragment>
                                                    )
                                                })
                                              )
                                          }
                                      </Link>
                                      <p>{item.productReviews}</p>
                                      <div className="shoppingBagTableMobileQuantity">
                                        <button
                                          onClick={() =>
                                            handleQuantityChange(
                                              item.id,
                                              item.quantity - 1
                                            )
                                          }
                                        >
                                          -
                                        </button>
                                        <input
                                          type="text"
                                          min="1"
                                          max="20"
                                          value={item.quantity}
                                          onChange={(e) =>
                                            handleQuantityChange(
                                              item.id,
                                              parseInt(e.target.value)
                                            )
                                          }
                                        />
                                        <button
                                          onClick={() =>
                                            handleQuantityChange(
                                              item.id,
                                              item.quantity + 1
                                            )
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                      <span><CurrencyText value={itemPrice}/></span>
                                    </div>
                                    <div className="shoppingBagTableMobileItemsDetailTotal">
                                      <MdOutlineClose
                                        size={20}
                                        onClick={() =>
                                          handleRemoveItem(item.id)
                                        }
                                      />
                                      <p><CurrencyText value={(item.quantity * itemPrice)}/></p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        }
                        <div className="shopCartFooter">
                          <div className="shopCartFooterContainer">
                            <form>
                              <input
                                type="text"
                                placeholder="Coupon Code"
                              ></input>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                }}
                              >
                                Apply Coupon
                              </button>
                            </form>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                              className="shopCartFooterbutton"
                            >
                              Update Cart
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="shoppingCartEmpty">
                        <span>Your cart is empty!</span>
                        <Link to="/shop" onClick={scrollToTop}>
                          <button>Shop Now</button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
                <div className="shoppingBagTotal">
                  <h3>Cart Totals</h3>
                  <table className="shoppingBagTotalTable">
                    <tbody>
                      <tr>
                        <th>Subtotal</th>
                        <td>
                           <CurrencyText value={subtotal}/>
                        </td>
                      </tr>
                      <tr>
                        <th>VAT</th>
                        <td>
                          <CurrencyText value={vat}/>
                        </td>
                      </tr>
                      <tr>
                        <th>Total</th>
                         <td>
                          <CurrencyText value={total}/>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <button
                    onClick={() => {
                      handleTabClick("cartTab2");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={productCarts.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}

            {/* tab2 */}
            {activeTab === "cartTab2" && (
              <div className="checkoutSection">
                <div className="checkoutDetailsSection">
                    <h4>Billing Details
                      <div className="sectionleft">
                      <div className="heroLink">
                        <span onClick={handleShowAddress}>
                          <h5>Get Your Address</h5>
                        </span>
                      </div>
                    </div>
                  </h4>
                  <div className="checkoutDetailsForm">
                     <Formik
                        innerRef={formikRef}
                        initialValues={{
                          company_name:'',
                          address: '',
                          brgy_code: '',
                          city_code: '',
                          province_code: '',
                          region_code:'',
                          postal_code:'',
                          notes: ''
                        }}
                        validationSchema={Schema}
                        // validateOnChange={false}
                        // validateOnBlur={false}
                       onSubmit={async (values, { resetForm }) => {
                          const result = await Swal.fire({
                            title: "Place Order?",
                            text: "Are you sure you want to place this order?",
                            icon: "question",
                            showCancelButton: true,
                            confirmButtonText: "Yes, place order",
                            cancelButtonText: "Cancel",
                          });

                          if (result.isConfirmed) {
                            // const response = await controller.checkOutCart(values);
                            // if (response) {
                              Swal.fire({
                                title: "Order Placed!",
                                text: "Your order has been successfully submitted.",
                                icon: "success",
                                confirmButtonText: "OK",
                              });

                              handleTabClick("cartTab3");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              setPayments(true);
                              setProductCarts([]);
                              // resetForm();
                            // }
                          }
                        }}
                                              >
                      {(formik) => (
                         <form noValidate onSubmit={formik.handleSubmit}>
                           <div className="form-group">
                            <label htmlFor="email" className="form-label">Company Name (optional)</label>
                              <input
                                type="text"
                                placeholder="Enter your Company Name"
                                {...formik.getFieldProps('company_name')}
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="email" className="form-label">Address (Bldg/Street/Village)</label>
                              <input 
                              type="text" 
                              placeholder="Bldg/Street/Village Address*" 
                               {...formik.getFieldProps('address')}
                              />
                            </div>
                            <div className="checkoutDetailsFormRow">
                               <div className="form-group">
                                <label htmlFor="region_code" className="form-label required">Region</label>
                                <RegionSelect
                                    name="region_code"
                                    value={formik.values.region_code}
                                    onChange={(e) => {
                                      formik.setFieldValue('region_code', e.target.value);
                                      formik.setFieldValue('province_code', ''); 
                                      formik.setFieldValue('city_code', '');
                                      formik.setFieldValue('brgy_code', '');
                                    }}
                                    onBlur={(e)=> {formik.handleBlur(e)}}
                                    error={formik.errors.region_code as string | undefined}
                                    touched={formik.touched.region_code as boolean | undefined}
                                />
                              </div>
                               <div className="form-group">
                                 <label htmlFor="province_code" className="form-label required">Province</label>
                                  <ProvinceSelect
                                      name="province_code"
                                      parentId={formik.values.region_code}
                                      value={formik.values.province_code}
                                      onChange={(e) => {
                                        formik.handleChange(e)
                                        formik.setFieldValue('province_code', e.target.value); 
                                        formik.setFieldValue('city_code', '');
                                        formik.setFieldValue('brgy_code', '');
                                      }}
                                      onBlur={(e)=> {formik.handleBlur(e)}}
                                      error={formik.errors.province_code as string | undefined}
                                      touched={formik.touched.province_code as boolean | undefined}
                                  />
                              </div>
                            </div>
                            <div className="checkoutDetailsFormRow">
                              <div className="form-group">
                                <label htmlFor="city_code" className="form-label required">City</label>
                                <CitySelect
                                  name="city_code"
                                  parentId={formik.values.province_code} 
                                  value={formik.values.city_code}
                                  onChange={(e) => {
                                      formik.setFieldValue('city_code', e.target.value);
                                      formik.setFieldValue('brgy_code', '');
                                  }}
                                  onBlur={(e)=> {formik.handleBlur(e)}}
                                  error={formik.errors.city_code as string | undefined}
                                  touched={formik.touched.city_code as boolean | undefined}
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="brgy_code" className="form-label required">Barangay</label>
                                <BrgySelect
                                  name="brgy_code"
                                  parentId={formik.values.city_code}
                                  value={formik.values.brgy_code}
                                  onChange={(e) => {
                                    formik.setFieldValue('brgy_code', e.target.value);
                                  }}
                                  onBlur={(e)=> {formik.handleBlur(e)}}
                                  error={formik.errors.brgy_code as string | undefined}
                                  touched={formik.touched.brgy_code as boolean | undefined}
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label htmlFor="brgy_code" className="form-label required">Postal/Zip Code</label>
                              <input
                              type='text'
                              placeholder="Enter your postal/zip code"
                              className={clsx( {
                                'is-invalid': formik.touched.postal_code && formik.errors.postal_code,
                              })}
                              {...formik.getFieldProps('postal_code')}
                            />
                           {formik.touched.postal_code && typeof formik.errors.postal_code === 'string' && (
                              <div className="form-error-message">
                                <span role="alert">{formik.errors.postal_code}</span>
                              </div>
                            )}
                            </div>
                            <textarea
                              cols={30}
                              rows={8}
                              placeholder="Order Notes (Optional)"
                              {...formik.getFieldProps('notes')}
                            />
                        </form>
                        )}
                      </Formik>
                  </div>
                </div>
                <div className="checkoutPaymentSection">
                  <div className="checkoutTotalContainer">
                    <h3>Your Order</h3>
                    <div className="checkoutItems">
                      <table>
                        <thead>
                          <tr>
                            <th>PRODUCTS</th>
                            <th>SUBTOTALS</th>
                          </tr>
                        </thead>
                        <tbody>
                       {productCarts.map((item: any) => {
                          const variantName = item.variant?.name
                                ? ` - ${item.variant.name}`
                                : "";

                          const addonsTotal = item.addons?.reduce(
                            (acc: number, addon: any) => acc + parseFloat(addon.price || 0),
                            0
                          );
                          
                          const itemPrice = (parseFloat(item.selling_price)  + parseFloat(addonsTotal));
                          return (
                           <tr key={`tab2-${item.id}`}>
                              <td>
                                {item.product_name} {variantName} - {<CurrencyText value={item.selling_price} />} x {item.quantity}
                                <br/>
                                  {
                                    item.addons.length > 0 && (
                                        item.addons.map((addon: any,index:number) => {
                                            return (
                                              <React.Fragment key={`addons-${index}`}>
                                                    <small>
                                                      - {addon.name}  {
                                                        addon.is_freebie == 'Y'? `` : <CurrencyText value={addon.price} />
                                                      }
                                                    </small>
                                                    <br/>
                                                </React.Fragment>
                                            )
                                        })
                                      )
                                  }
                              </td>
                              <td>
                                <CurrencyText value={itemPrice * item.quantity} />
                              </td>
                            </tr>
                          );
                        })}
                        </tbody>
                      </table>
                    </div>
                    <div className="checkoutTotal">
                      <table>
                        <tbody>
                          <tr>
                            <th>Subtotal</th>
                            <td><CurrencyText value={subtotal}/></td>
                          </tr>
                          <tr>
                            <th>VAT</th>
                            <td><CurrencyText value={vat}/></td>
                          </tr>
                          <tr>
                            <th>Total</th>
                            <td>
                             <CurrencyText value={total}/>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="checkoutPaymentContainer">
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        defaultChecked
                        onChange={handlePaymentChange}
                      />
                      <div className="checkoutPaymentMethod">
                        <span>Cash on delivery (COD)</span>
                        <p>
                          Pay for your order in cash when it is delivered to your doorstep.
                          Please ensure that the exact amount is ready upon delivery to make the process smooth and hassle-free.
                        </p>
                      </div>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        value="DIRECT_BANK_TRANSFER"
                        onChange={handlePaymentChange}
                      />
                      <div className="checkoutPaymentMethod">
                        <span>Direct Bank Transfer</span>
                        <p>
                         Make your payment directly to our bank account. Please use your Order ID as the payment reference.
                         Your order will be processed once the payment has been confirmed and cleared in our account.
                        </p>
                      </div>
                    </label>
                     <label>
                      <input
                        type="radio"
                        name="payment"
                        value="PICK_UP"
                        onChange={handlePaymentChange}
                      />
                      <div className="checkoutPaymentMethod">
                        <span>Pick Up</span>
                        <p>
                          Reserve your order online and collect it directly from our store.
                          Please wait for a confirmation message before visiting to ensure your order is ready for pickup.
                          Payment can be made in cash or via available methods upon collection.
                        </p>
                      </div>
                    </label>
                  </div>
                  <button
                   onClick={() => {
                      formikRef.current?.handleSubmit();
                    }}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}

            {/* tab3 */}
            {activeTab === "cartTab3" && (
              <div className="orderCompleteSection">
                <div className="orderComplete">
                  <div className="orderCompleteMessage">
                    <div className="orderCompleteMessageImg">
                      <img src={success} alt="" />
                    </div>
                    <h3>Your order is completed!</h3>
                    <p>Thank you. Your order has been received.</p>
                  </div>
                  <div className="orderInfo">
                    <div className="orderInfoItem">
                      <p>Order Number</p>
                      <h4>{orderNumber}</h4>
                    </div>
                    <div className="orderInfoItem">
                      <p>Date</p>
                      <h4>{formatDate(currentDate)}</h4>
                    </div>
                    <div className="orderInfoItem">
                      <p>Total</p>
                      <CurrencyText value={total}/>
                    </div>
                    <div className="orderInfoItem">
                      <p>Payment Method</p>
                      <h4>{selectedPayment}</h4>
                    </div>
                  </div>
                  <div className="orderTotalContainer">
                    <h3>Order Details</h3>
                    <div className="orderItems">
                      <table>
                        <thead>
                          <tr>
                            <th>PRODUCTS</th>
                            <th>SUBTOTALS</th>
                          </tr>
                        </thead>
                        <tbody>
                         {productCarts.map((item: any) => {
                          const variantName = item.variant?.name
                                ? ` - ${item.variant.name}`
                                : "";

                          const addonsTotal = item.addons?.reduce(
                            (acc: number, addon: any) => acc + parseFloat(addon.price || 0),
                            0
                          );
                          
                          const itemPrice = (parseFloat(item.selling_price)  + parseFloat(addonsTotal));
                            return (
                              <tr key={`tab3-${item.id}`}>
                                <td>
                                  {item.product_name} {variantName} - {<CurrencyText value={item.selling_price} />} x {item.quantity}
                                   <br/>
                                  {
                                    item.addons.length > 0 && (
                                        item.addons.map((addon: any,index:number) => {
                                            return (
                                              <React.Fragment key={`addons-${index}`}>
                                                    <small>
                                                      - {addon.name}  {
                                                        addon.is_freebie == 'Y'? `` : <CurrencyText value={addon.price} />
                                                      }
                                                    </small>
                                                    <br/>
                                                </React.Fragment>
                                            )
                                        })
                                      )
                                  }
                                </td>
                                <td>
                                  <CurrencyText value={itemPrice * item.quantity} />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="orderTotal">
                      <table>
                        <tbody>
                          <tr>
                            <th>Subtotal</th>
                            <td><CurrencyText value={subtotal}/></td>
                          </tr>
                          <tr>
                            <th>Shipping</th>
                            <td><CurrencyText value={shipping}/></td>
                          </tr>
                          <tr>
                            <th>VAT</th>
                            <td><CurrencyText value={vat}/></td>
                          </tr>
                          <tr>
                            <th>Total</th>
                            <td><CurrencyText value={total}/></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
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

export default ShoppingCart;
