import React, { useState, useEffect } from "react";
import "./ShopDetails.css";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import defaultImage from "@/assets/ProductDetail/default.jpg";
import { FaBoxOpen, FaEye, FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { IoFilterSharp, IoClose } from "react-icons/io5";
import Filter from "../Filters/Filter";
import { CategoryModel, BrandModel, ProductModel } from "@/Model/DataModel";
import { CurrencyText } from "@/components/inputmasks/CurrencyText";
import { LoginModal } from "@/modules/Authentication/LoginSign/LoginModal";
import Popup from "@/components/ModalHandler/Popup";
import { ModalResponse } from "@/utils/types";
import { useAuth } from "@/modules/Authentication";
import { useFilter } from "@/services/FilterServices";
import { useProduct } from "@/services/ProductServices";

const ShopDetails = () => {
  const [categories, setCategories] = useState<CategoryModel[]>([]);
  const [brands, setBrands] = useState<BrandModel[]>([]);
  const [globalRange, setGlobalRange] = useState<[number, number]>([0, 99999]); // backend range
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 99999]);  // current selection
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);

  const [sortOption, setSortOption] = useState<string>("default");
  const [pagination, setPagination] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { category } = useParams<{ category: string }>();
  const { fetchProducts } = useProduct();
  const filterController = useFilter();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [modalState, setModalState] = useState<ModalResponse>({
    visible: false,
    title: "",
    body: <></>,
    className: "modal-xl",
    alignment: "centered",
  });

  const [wishList, setWishList] = useState<any>({});

  const loadInitialData = async () => {
    const resCategory = await filterController.fetchCategory();
    if (resCategory) setCategories(resCategory);

    const resBrands = await filterController.fetchBrands();
    if (resBrands) setBrands(resBrands);

    const resPriceRange = await filterController.fetchPriceRange();
    if (resPriceRange) {
        setGlobalRange([resPriceRange.minPrice, resPriceRange.maxPrice]);
        setPriceRange([resPriceRange.minPrice, resPriceRange.maxPrice]);
    }
  };

  const loadProducts = async (page = 1) => {
    const res = await fetchProducts(
      page,
      category === "all" ? undefined : category,
      selectedBrands,
      priceRange[0],
      priceRange[1],
      sortOption
    );

    if (res?.data) {
      setProducts(res.data);
      setPagination(res.pagination ?? null);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    loadProducts(1);
  }, [category, selectedBrands, priceRange, sortOption]);

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: "smooth", }); };

  const goToProduct = (id: string | number) => { 
    scrollToTop() 
    navigate(`/product/${id}`); 
  };

  // --- wishlist
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

  return (
    <div className="shopDetails">
      <div className="shopDetailMain">
        {/* Left - Filters */}
        <div className="shopDetails__left">
          <Filter
           categories={categories}
            brands={brands}
            globalRange={globalRange}
            priceRange={priceRange}
            onBrandChange={setSelectedBrands}
            onPriceChange={setPriceRange}
          />
        </div>

        {/* Right - Products */}
        <div className="shopDetails__right">
          {/* Sorting + Filter button */}
          <div className="shopDetailsSorting">
            <div className="shopDetailsBreadcrumbLink">
              <Link to="/">Home</Link> / <Link to="/shop/all">The Shop</Link>
            </div>
            <div className="filterLeft" onClick={() => setIsDrawerOpen(true)}>
              <IoFilterSharp /> <p>Filter</p>
            </div>
            <div className="shopDetailsSort">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Default Sorting</option>
                <option value="Featured">Featured</option>
                <option value="bestSelling">Best Selling</option>
                <option value="a-z">Alphabetically, A-Z</option>
                <option value="z-a">Alphabetically, Z-A</option>
                <option value="lowToHigh">Price, Low to High</option>
                <option value="highToLow">Price, High to Low</option>
                <option value="oldToNew">Date, Old to New</option>
                <option value="newToOld">Date, New to Old</option>
              </select>
            </div>
          </div>

          {/* Products */}
          <div className="shopDetailsProducts">
            <div className="shopDetailsProductsContainer">
              {products.length > 0 ? (
                products.map((product) => (
                  <div className="sdProductContainer" key={product.id_encrypted}>
                    <div className="sdProductImages">
                      <img src={product.primary_image?.image_cover || defaultImage} alt="" />
                      <h4 onClick={() => goToProduct(product.id_encrypted)}>View Details</h4>
                    </div>
                    <div className="sdProductInfo">
                      <p>{product.category?.name} ({product.brand?.name})</p>
                      <FiHeart
                        onClick={() => handleWishlistClick(product.id_encrypted)}
                        style={{
                          color: wishList[product.id_encrypted]
                            ? "red"
                            : "#767676",
                        }}
                      />
                      <h5>{product.name}</h5>
                      <p>{
                          product.variants_min_selling_price && product.variants_max_selling_price
                          ? product.variants_min_selling_price === product.variants_max_selling_price
                            ? <CurrencyText value={product.variants_min_selling_price}/>
                            : <><CurrencyText value={product.variants_min_selling_price}/> - <CurrencyText value={product.variants_max_selling_price}/></>
                          : <CurrencyText value={product.selling_price}/>
                          }
                        </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="noProduct">
                  <FaBoxOpen /> <p>No Product available</p>
                </div>
              )}
            </div>
          </div>
          {
            products.length > 0 && pagination && ( 
              <div className="shopDetailsPagination"> 
                  <div className="sdPaginationPrev"> 
                    {
                      pagination.current_page > 1 && ( 
                      <p onClick={() => loadProducts(pagination.current_page - 1)}> 
                      <FaAngleLeft /> Prev 
                      </p> 
                      )
                    } 
                  </div> 
                  <div className="sdPaginationNumber"> 
                    <div className="paginationNum"> 
                      {
                      Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => ( 
                        <p key={page} onClick={() => loadProducts(page)} className={page === pagination.current_page ? "activePage" : ""} > 
                        {page} 
                        </p> 
                        ))
                        } 
                    </div> 
                  </div> 
                  <div className="sdPaginationNext"> 
                    {
                      pagination.current_page < pagination.last_page && ( 
                      <p onClick={() => loadProducts(pagination.current_page + 1)}>
                        Next <FaAngleRight /> 
                      </p> 
                      )
                    } 
                  </div> 
              </div> 
            )
          }
        </div>
      </div>
              
      {/* Drawer for Mobile */}
      <div className={`filterDrawer ${isDrawerOpen ? "open" : ""}`}>
        <div className="drawerHeader">
          <p>Filter By</p>
          <IoClose onClick={() => setIsDrawerOpen(false)} size={26} />
        </div>
        <div className="drawerContent">
          <Filter
            categories={categories}
            brands={brands}
            globalRange={globalRange}
            priceRange={priceRange}
            onBrandChange={setSelectedBrands}
            onPriceChange={setPriceRange}
          />
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
    </div>
  );
};

export default ShopDetails;
