import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    product:{}
}

export const ProductSlice = createSlice({
    name: 'Product',
    initialState: initialState,
    reducers: {
        //The following is a reducer function used to store the product 
        setProduct(state, action) {
            state.product = action.payload
        }
    }
})

export default ProductSlice
export const ProductActions = ProductSlice.actions