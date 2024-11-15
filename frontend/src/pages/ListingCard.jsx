import React, { useState } from 'react'
import '../styles/ListeningCard.scss';
import { ArrowForwardIos, ArrowBackIosNew, Favorite} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { setWishList } from '../redux/state';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const ListingCard = ({listingId, creator, listingPhotoPaths, city, province, country, category, type, 
                      price, startDate, endDate, totalPrice, booking}) => {
    /* SLIDER FOR IMAGES */
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();
  
    /* ADD TO WISHLIST */
    const user = useSelector((state) => state.user.user);
    const wishList = user?.wishList || [];
  
    const isLiked = wishList.find((item) => item?._id === listingId);
  
    const patchWishList = async() => {
      /* the client is nor the property owner */
      if (user?._id !== creator._id) {
      const response = await fetch(
        // eslint-disable-next-line no-undef
        `${process.env.REACT_APP_API_URL}/users/${user?._id}/${listingId}`,
        {
          method: "PATCH",
          header: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      dispatch(setWishList({listing : data.wishList}));
      console.log("my wish list" , wishList)
    } 
    };

    const goToPrevSlide = () => {
      setCurrentIndex(
        (prevIndex) =>
          (prevIndex - 1 + listingPhotoPaths.length) % listingPhotoPaths.length
      );
    };
  
    const goToNextSlide = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % listingPhotoPaths.length);
    };
  return (
    <div className='listing-card' onClick={() => { navigate(`/properties/${listingId}`);}}>
        <div className="slider-container">
            <div className="slider" >
                {listingPhotoPaths?.map((photo, index) => (
                    /* the transform animation will apply to all div.slide each time we click to prev or next button */
                    <div key={index} className="slide" style={{ transform: `translateX(-${currentIndex * 100}%)`, transition: 'all 2s' }}>
                        <img src={`${photo}`} alt="" />
                        <div className="prev-button" onClick={(e) => { e.stopPropagation(); goToPrevSlide(e) }}>
                            <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                        </div>
                        <div className="next-button" onClick={(e) => { e.stopPropagation(); goToNextSlide(e)}}>
                            <ArrowForwardIos sx={{ fontSize: "15px" }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        <h3> {city}, {province}, {country} </h3>
        <p>{category}</p>

        {!booking ? (
          <>
            <p>{type}</p>
            <p> <span>${price}</span> per night </p>
          </>
        ) : (
          <>
            <p> {startDate} - {endDate} </p>
            <p> <span>${totalPrice}</span> total </p>
          </>
        )}

        <button className="favorite" onClick={(e) => { e.stopPropagation(); patchWishList() }}>
          {isLiked ? ( <Favorite sx={{ color: "red" }} /> ) : ( <Favorite sx={{ color: "white" }} /> )}
        </button>
    </div>
  )
}

export default ListingCard