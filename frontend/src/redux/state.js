import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  listings: [],
  reservationList: [],
  wishList: [], 
  propertyList: [],
  tripList: []
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.tripList = []
      state.propertyList = []
      state.reservationList = []
      state.listings = []
    },
    setListings: (state, action) => {
      state.listings = action.payload.listing;
    },
    setTripList: (state, action) => {
      state.tripList = action.payload.listing;
    },
    setWishList: (state, action) => {
      state.user.wishList = action.payload.listing
    },
    setPropertyList: (state, action) => {
      state.propertyList = action.payload.listing
    },
    setReservationList: (state, action) => {
      state.reservationList = action.payload.listing
    },
  },
});

export const {
  setLogin,
  setLogout,
  setListings,
  setTripList,
  setWishList,
  setPropertyList,
  setReservationList,
} = userSlice.actions;
export default userSlice.reducer;
