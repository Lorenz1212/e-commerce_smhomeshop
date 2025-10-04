import React, { useState } from "react";
import "./Filter.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { IoIosArrowDown } from "react-icons/io";
import { BiSearch } from "react-icons/bi";
import Slider from "@mui/material/Slider";
import { useParams, useNavigate } from "react-router-dom";
import { BrandModel, CategoryModel } from "@/Model/DataModel";
import { CurrencyText } from "@/components/inputmasks/CurrencyText";

type FilterProps = {
  categories: CategoryModel[];
  brands: BrandModel[];
  globalRange: [number, number]; // full range from backend
  priceRange: [number, number];  // current selected range
  onBrandChange: (brands: string[]) => void;
  onPriceChange: (range: [number, number]) => void;
};

const Filter: React.FC<FilterProps> = ({
  categories,
  brands,
  globalRange,
  priceRange,
  onBrandChange,
  onPriceChange,
}) => {
  const navigate = useNavigate();
  const { category } = useParams<{ category: string }>();

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleBrand = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];

    setSelectedBrands(newBrands);
    onBrandChange(newBrands);
  };

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="filterSection">
      {/* Categories */}
      <div className="filterCategories">
        <Accordion defaultExpanded disableGutters elevation={0}>
          <AccordionSummary
            expandIcon={<IoIosArrowDown size={20} />}
            sx={{ padding: 0, marginBottom: 2 }}
          >
            <h5 className="filterHeading">Product Categories</h5>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <p
              key={0}
              onClick={() => navigate(`/shop/all`)}
              className={`categoryItem ${
                category?.toLowerCase() === "all" ? "activeCategory" : ""
              }`}
            >
              All
            </p>
            {categories.map((cat, index) => (
              <p
                key={index}
                onClick={() => navigate(`/shop/${cat.name.toLowerCase()}`)}
                className={`categoryItem ${
                  category?.toLowerCase() === cat.name.toLowerCase()
                    ? "activeCategory"
                    : ""
                }`}
              >
                {cat.name}
              </p>
            ))}
          </AccordionDetails>
        </Accordion>
      </div>

      {/* Brands */}
      <div className="filterBrands">
        <Accordion defaultExpanded disableGutters elevation={0}>
          <AccordionSummary
            expandIcon={<IoIosArrowDown size={20} />}
            sx={{ padding: 0, marginBottom: 2 }}
          >
            <h5 className="filterHeading">Brands</h5>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <div className="searchBar">
              <BiSearch className="searchIcon" size={20} color={"#767676"} />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="brandList">
              {filteredBrands.length > 0 ? (
                filteredBrands.map((brand, index) => (
                  <div className="brandItem" key={index}>
                    <input
                      type="checkbox"
                      id={`brand-${index}`}
                      className="brandRadio"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => toggleBrand(brand.name)}
                    />
                    <label htmlFor={`brand-${index}`} className="brandLabel">
                      {brand.name}
                    </label>
                    <span className="brandCount">{brand.product_count}</span>
                  </div>
                ))
              ) : (
                <div className="notFoundMessage">Not found</div>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>

      {/* Price */}
      <div className="filterPrice">
        <Accordion defaultExpanded disableGutters elevation={0}>
          <AccordionSummary
            expandIcon={<IoIosArrowDown size={20} />}
            sx={{ padding: 0, marginBottom: 2 }}
          >
            <h5 className="filterHeading">Price</h5>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            <Slider
              min={globalRange[0]}   // full min from backend
              max={globalRange[1]}   // full max from backend
              value={priceRange}     // current selection
              onChange={(_, newValue) => {
                if (Array.isArray(newValue)) {
                  onPriceChange(newValue as [number, number]);
                }
              }}
              valueLabelDisplay="auto"
              valueLabelFormat={(val) => `Php ${val}`}
              sx={{
                color: "black",
                "& .MuiSlider-thumb": {
                  backgroundColor: "white",
                  border: "2px solid black",
                  width: 18,
                  height: 18,
                },
              }}
            />

            <div className="filterSliderPrice">
              <div className="priceRange">
                <p>
                  Min Price: <span><CurrencyText value={priceRange[0]} /></span>
                </p>
                <p>
                  Max Price: <span><CurrencyText value={priceRange[1]} /></span>
                </p>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default Filter;
