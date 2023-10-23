
import { Fragment, useCallback, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

//This component is the navigation bar
function ProductOverview() {
    const navigate = useNavigate()
    const product = useSelector(state => state.ProductStore.product) //This state is the product selected by the user 
    const [productInCart, setProductInCart] = useState() //This state is true if the product is in the cart and vicec-versa
    const [loading, setLoading] = useState(true) //This state is used to manage loading when photos are being fetched
    const [error, setError] = useState(false) //This state is used to manage errors that occur while fetching photos
    const email = localStorage.getItem('thinsil_email') //This variable is used to store the email which is being logged in

    // This function is used to check if the product is present in the cart or not
    const isProductPresentIncart = useCallback(async () => {
        setError(false)
        setLoading(true)
        try {
            const response = await fetch(`https://thinsil-backend.onrender.com/cart/isProductPresentInCart?email=${email}&productId=${product.id}`)
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'exists') {
                setProductInCart(true)
            } else {
                setProductInCart(false)
            }
            setLoading(false)
        } catch (error) {
            setError(true)
            setLoading(false)
        }
    }, [email, product.id])

    useEffect(() => {
        isProductPresentIncart()
    }, [isProductPresentIncart])

    //This function is used to add or remove a product from the cart
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
                setProductInCart(productInCart => !productInCart)
            }
        } catch (error) {
            setError(true)
        }
    }

    return (
        <Fragment>
            {!loading && <div className="fixed top-16 w-full bg-white pt-3 pb-3 pl-4">
                <button type='button' className=" bg-lime-500 text-white font-medium rounded-lg pl-2 pr-2 h-8" onClick={() => {
                    navigate('/')
                }}>Home</button>
            </div>}
            {error && !loading &&
                <div className="fixed top-40 w-full flex flex-col place-items-center">
                    <p >Some error occured.</p>
                    <p className="text-red-500 cursor-pointer" onClick={() => {
                        isProductPresentIncart()
                    }}>Reload</p>
                </div>}
            {!error && !loading && <><div className="w-full flex justify-center pt-32">

                <div className="w-11/12 sm:w-9/12 md:w-7/12 lg:w-6/12 xl:w-5/12  pb-10 ">
                    <div className="w-full flex justify-center ">
                        <img className="w-fit h-64 cursor-pointer " src={product.image} alt='' />
                    </div>
                    <p className="text-lg font-bold">{product.description}</p>
                    <div className="flex flex-row gap-3 mt-2">
                        <p className="text-gray-800 font-bold">Category:</p>
                        <p>${product.category}</p>
                    </div>
                    <div className="flex flex-row gap-3 ">
                        <p className="text-gray-800 font-bold">Price:</p>
                        <p >${product.price}</p>
                    </div>
                    <div className="flex flex-row gap-3">
                        <p className="text-gray-800 font-bold">Rating:</p>
                        <p>{product.rating.rate}/5</p>
                    </div>
                    <div className="w-full  flex justify-center mt-2 mb-2">
                        <button type='button' className=" bg-yellow-500  font-medium rounded-lg pl-2 pr-2 h-8" onClick={() => {
                            if (productInCart) {
                                addRemoveCartItem('remove', product.id)
                            } else {
                                addRemoveCartItem('add', product.id)
                            }
                        }}>{productInCart ? 'Remove from cart' : 'Add to cart'}</button>
                    </div>
                </div>
            </div></>}
        </Fragment>
    )
}
export default ProductOverview