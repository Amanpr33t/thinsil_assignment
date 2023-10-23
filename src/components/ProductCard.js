import { Fragment } from "react"
import { useDispatch } from "react-redux"
import { ProductActions } from "../store/slices/productOverviewSlice"
import { useNavigate } from "react-router-dom"
/*
This component is used to show the products in a card. It receives some props:
1) product: It is the object that stores the product
2) cartItems: It is an array that contains all the ids of the cart items
3) fetchCartItems: This function is used to fetch all the cart items
4) alertModalSetter: This function is used to show an alert modal when an error occurs
*/
function ProductCard({ product, cartItems, fetchCartItems,alertModalSetter }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    //const cartItems = useSelector(state => state.CartItemsStore.cartItems)
    const email = localStorage.getItem('thinsil_email')

    //This function is used to add or remove from the cart
    const addRemoveCartItem = async (operation, productId) => {
        try {
            const response = await fetch(`https://thinsil-backend.onrender.com/cart/${operation}`, {
                method: 'PATCH',
                body: JSON.stringify({ email, productId }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                fetchCartItems()
            }
        } catch (error) {
            alertModalSetter()
        }
    }

    return (
        <Fragment>
            < div key={product.id} className=" w-80 shadow-lg flex flex-col ">
                <div className="w-full flex justify-center ">
                    <img className="w-fit h-64 cursor-pointer " src={product.image} alt='' onClick={() => {
                        dispatch(ProductActions.setProduct(product))
                        navigate('/product')
                    }} />
                </div>
                <p className="w-full text-center font-bold mt-2">{product.title}</p>
                <div className="flex flex-row place-content-center gap-6 mt-2">
                    <p className="font-semibold">Price:</p>
                    <p>${product.price}</p>
                </div>
                <div className="flex flex-row place-content-center gap-6 mb-1">
                    <p className="font-semibold">Rating:</p>
                    <p>{product.rating.rate}/5</p>
                </div>
                <div className="w-full  flex justify-center mt-2 mb-2">
                    <button type='button' className=" bg-yellow-500  font-medium rounded-lg pl-2 pr-2 h-8" onClick={() => {
                        if (cartItems.includes(product.id)) {
                            addRemoveCartItem('remove', product.id)
                        } else {
                            addRemoveCartItem('add', product.id)
                        }
                    }}>{cartItems.includes(product.id) ? 'Remove from cart' : 'Add to cart'}</button>
                </div>
            </div>
        </Fragment>
    )
}
export default ProductCard