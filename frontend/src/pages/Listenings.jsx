/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { categories } from "../data";
import "../styles/Listenings.scss";
import ListingCard from "./ListingCard";
import { useDispatch, useSelector } from "react-redux";
import { setListings } from "../redux/state";
import Loader from "../components/Loader";

const Listenings = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const listings = useSelector((state) => state.user.listings);

  const getFeedListings = async () => {
    try {
      const response = await fetch(
        selectedCategory !== "All"
          ? `${process.env.REACT_APP_API_URL}/listening?category=${selectedCategory}`
          : `${process.env.REACT_APP_API_URL}/listening`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch(setListings({ listing: data.listings }));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listings Failed", err.message);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [selectedCategory]);

  return (
    <>
      <div className="category-list">
        {categories?.map((category, index) => (
          <div key={index} onClick={() => setSelectedCategory(category.label)}
               className={`category ${category.label === selectedCategory ? "selected" : ""}`}>
            <div className="category_icon">{category.icon}</div>
            <p>{category.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="listings">
          {listings?.map(({ _id, creator, listingPhotoPaths, city, province, country, category,
                          type, price, booking=false}) => (
              <ListingCard key={_id} listingId={_id} creator={creator} listingPhotoPaths={listingPhotoPaths} city={city} 
                province={province} country={country} category={category} type={type} price={price} booking={booking}/>
            )
          )}
        </div>
      )}
    </>
  );
};

export default Listenings;
