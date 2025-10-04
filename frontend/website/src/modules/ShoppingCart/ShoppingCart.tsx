import React, { useEffect, useState } from "react";
import "./ShoppingCart.css";
import { useSelector, useDispatch } from "react-redux";
import defaultImage from "@/assets/ProductDetail/default.jpg";
import { MdOutlineClose } from "react-icons/md";
import { Link } from "react-router-dom";
import success from "../../Assets/success.png";
import { useCart } from "@/services/CartService";
import { CurrencyText } from "@/components/inputmasks/CurrencyText";

const ShoppingCart = () => {

  const controller = useCart();

  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [vat, setVat] = useState(0);
  const [total, setTotal] = useState(0);

  const [productCarts, setProductCarts] = useState<any>([]);

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
    loadProductCart();
  }, []);

  
  useEffect(() => {
    calculateTotals(productCarts);
  }, [productCarts]);

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
    }
  };

  const handleRemoveItem = (cart_id:any) => {
    const updatedCart = productCarts.filter((item:any) => item.id !== cart_id);
    setProductCarts(updatedCart);
    calculateTotals(updatedCart);
  };


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
  const [selectedPayment, setSelectedPayment] = useState(
    "Direct Bank Transfer"
  );

  const handlePaymentChange = (e:any) => {
    setSelectedPayment(e.target.value);
  };

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
              disabled={cartItems.length === 0}
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
              disabled={cartItems.length === 0 || payments === false}
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
                                        <h4>{item.product_name} {variantName}</h4>
                                          {
                                              item.addons.length > 0 && (
                                          
                                                item.addons.map((item: any) => {
                                                  return (
                                                    <>
                                                      <small key={item.id}>
                                                          {item.name} - <CurrencyText value={item.price}/>
                                                      </small>
                                                    </>
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
                                          
                                                item.addons.map((item: any) => {
                                                  return (
                                                    <>
                                                      <small>
                                                          {item.name} - <CurrencyText value={item.price}/>
                                                      </small>
                                                    </>
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
                                              item.productID,
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
                                              item.productID,
                                              parseInt(e.target.value)
                                            )
                                          }
                                        />
                                        <button
                                          onClick={() =>
                                            handleQuantityChange(
                                              item.productID,
                                              item.quantity + 1
                                            )
                                          }
                                        >
                                          +
                                        </button>
                                      </div>
                                      <span>${item.productPrice}</span>
                                    </div>
                                    <div className="shoppingBagTableMobileItemsDetailTotal">
                                      <MdOutlineClose
                                        size={20}
                                        // onClick={() =>
                                        //   dispatch(removeFromCart(item.productID))
                                        // }
                                      />
                                      <p>${item.quantity * item.productPrice}</p>
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
                  <h4>Billing Details</h4>
                  <div className="checkoutDetailsForm">
                    <form>
                      <div className="checkoutDetailsFormRow">
                        <input type="text" placeholder="First Name" />
                        <input type="text" placeholder="Last Name" />
                      </div>
                      <input
                        type="text"
                        placeholder="Company Name (optional)"
                      />
                      <select name="country" id="country">
                        <option value="Country / Region" selected disabled>
                          Country / Region
                        </option>
                        <option value="India">India</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Turkey">Turkey</option>
                      </select>
                      <input type="text" placeholder="Street Address*" />
                      <input type="text" placeholder="" />
                      <input type="text" placeholder="Town / City *" />
                      <input type="text" placeholder="Postcode / ZIP *" />
                      <input type="text" placeholder="Phone *" />
                      <input type="mail" placeholder="Your Mail *" />
                      <textarea
                        cols={30}
                        rows={8}
                        placeholder="Order Notes (Optional)"
                      />
                    </form>
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
                          const variantName = item.variant?.name ? ` - ${item.variant.name}` : "";
                          return (
                           <tr key={`tab2-${item.id}`}>
                              <td>
                                {item.product_name} {variantName} x {item.quantity}
                              </td>
                              <td>
                                <CurrencyText value={item.selling_price * item.quantity} />
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
                        value="Direct Bank Transfer"
                        defaultChecked
                        onChange={handlePaymentChange}
                      />
                      <div className="checkoutPaymentMethod">
                        <span>Direct Bank Transfer</span>
                        <p>
                          Make your payment directly into our bank account.
                          Please use your Order ID as the payment reference.Your
                          order will not be shipped until the funds have cleared
                          in our account.
                        </p>
                      </div>
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        value="Cash on delivery"
                        onChange={handlePaymentChange}
                      />
                      <div className="checkoutPaymentMethod">
                        <span>Cash on delivery</span>
                        <p>
                          Phasellus sed volutpat orci. Fusce eget lore mauris
                          vehicula elementum gravida nec dui. Aenean aliquam
                          varius ipsum, non ultricies tellus sodales eu. Donec
                          dignissim viverra nunc, ut aliquet magna posuere eget.
                        </p>
                      </div>
                    </label>
                  </div>
                  <button
                    onClick={() => {
                      handleTabClick("cartTab3");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      setPayments(true);
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
                            const variantName = item.variant?.name ? ` - ${item.variant.name}` : "";
                            return (
                              <tr key={`tab3-${item.id}`}>
                                <td>
                                  {item.product_name} {variantName} x {item.quantity}
                                </td>
                                <td>
                                  <CurrencyText value={item.selling_price * item.quantity} />
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
    </>
  );
};

export default ShoppingCart;
