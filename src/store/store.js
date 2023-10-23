import { configureStore } from "@reduxjs/toolkit";
import ProductSlice from "./slices/productOverviewSlice";


//The store stores all the data we want manage using react-redux
const store = configureStore({
  reducer: {
    ProductStore: ProductSlice.reducer
  }
})

export default store