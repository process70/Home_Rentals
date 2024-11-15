/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react'
import  "../styles/listeningDetails.scss";
import { useNavigate, useParams } from 'react-router-dom';
import { DateRange } from 'react-date-range';
import { facilities } from '../data';
import Loader from '../components/Loader';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useSelector } from 'react-redux';
import Navbar from 'src/components/Navbar';

const ListeningDetails = () => {

  const [loading, setLoading] = useState(true);
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);

  const [ranges, setRanges] = useState([{
    startDate: new Date(),
    endDate: new Date(),
    key: "selection"
  }])

  const handleSelect = (range) => {
    setRanges([range.selection]);
  }

  const start = new Date(ranges[0].startDate);
  const end = new Date(ranges[0].endDate);
   /* Calculate the difference in day unit
   end-start get in milisecond */
  const dayCount = Math.round(end - start) / (1000 * 60 * 60 * 24);

  const getListingDetails = async () => {
    try {
      const response = await fetch( `${process.env.REACT_APP_API_URL}/listening/${listingId}`, { method: "GET" });

      const data = await response.json();
      setListing(data);
      setLoading(false);
    } catch (err) {
      console.log("Fetch Listing Details Failed", err.message);
    }
  };

  useEffect(() => {
    getListingDetails();
  }, []);

    /* SUBMIT BOOKING */
    const customerId = useSelector((state) => state.user.user?._id)

    const navigate = useNavigate()
  
    const handleSubmit = async () => {
      try {
        const bookingForm = { customerId, listingId, hostId: listing?.creator._id,
          startDate: ranges[0].startDate.toDateString(),
          endDate: ranges[0].endDate.toDateString(),
          totalPrice: listing.price * dayCount,
        }
        console.log(bookingForm)
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/booking/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json"},
          body: JSON.stringify(bookingForm)
        })
  
        if (response.ok) {
          navigate(`/${customerId}/trips`)
        }
      } catch (err) {
        console.log("Submit Booking Failed.", err.message)
      }
    }

  return loading ? (<Loader />) : (
    <div className="listing-details">
      <Navbar />
        <div className="title">
            <h1>{listing?.title}</h1>
            <div></div>
        </div>
        
        <div className="photos">
          {listing?.listingPhotoPaths?.map((photo, index) => (
            <img key={index} src={`${photo}`} alt={index} />
          ))}
        </div>
        
        <h2>{listing?.type} in {listing?.city}, {listing?.province},{" "}{listing?.country}</h2>
        <p>
          {listing?.guestCount} guests - {listing?.bedroomCount} bedroom(s) - {" "}
          {listing?.bedCount} bed(s) - {listing?.bathroomCount} bathroom(s)
        </p>
        <hr />
        
        <div className="profile">
          <img src={`${listing?.creator.profileImage}`}/>
          <h3>Hosted by {listing?.creator.firstName} {listing?.creator.lastName}</h3>
        </div>
        <hr />

        <h3>Description</h3>
        <p>{listing?.description}</p>
        <hr />

        <h3>{listing?.highlight}</h3>
        <p>{listing?.highlightDesc}</p>
        <hr />

        <div className="booking">
          <div>
            <h2>What this place offers?</h2>
            <div className="amenities">
              {listing?.amenities[0].split(",").map((item, index) => (
                  <div className="facility" key={index}>
                    <div className="facility_icon">
                      {facilities.find((facility) => facility.name === item)?.icon}
                    </div>
                    <p>{item}</p>
                  </div>
              ))}
            </div>
          </div>

          <div>
            <h2>How long do you want to stay?</h2>
            <div className="date-range-calendar">
              <DateRange ranges={ranges} onChange={handleSelect} />
              {dayCount > 1 ? 
                (<h2> ${listing.price} x {dayCount} nights </h2>) : 
                (<h2> ${listing.price} x {dayCount} night </h2>)}
                
              {<h2>Total price: ${listing.price * dayCount}</h2>}
              <p>Start Date: {ranges[0].startDate.toDateString()}</p>
              <p>End Date: {ranges[0].endDate.toDateString()}</p>

              <button className="button" type="submit" onClick={handleSubmit}>
                BOOKING
              </button>
            </div>
          </div>
    </div>
  </div>  
  )
}

export default ListeningDetails