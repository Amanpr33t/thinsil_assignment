import { Fragment, useState, useCallback, useEffect } from "react"
import { useNavigate } from "react-router-dom"

//This component is used to show all the cart items
function Cart() {
    const [cartItems, setCartItems] = useState([]) //This state is used to store all the products available in the cart
    const [loading, setLoading] = useState(true) //This state is used to manage loading when photos are being fetched
    const [error, setError] = useState(false) //This state is used to manage errors that occur while fetching photos
    const [cartEmpty, setCartEmpty] = useState(false) //This state is set to true when the cart is empty, and vice-versa
    const email = localStorage.getItem('thinsil_email') //This variable is used to store the email which is being logged in
    const [buttonSpinner, setButtonSpinner] = useState(false) //This state is used to show a spinner when the user removes an item from the cart
    const navigate = useNavigate()

    //This function is used to fetch a particular product
    const fetchProducts = async (id) => {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`)
        if (!response.ok) {
            throw new Error('Some error occured')
        }
        const data = await response.json()
        setCartItems(cartItems => [...cartItems, data])
    }

    //This function is used to fetch all the products present in the cart
    const fetchCartItems = useCallback(async () => {
        setLoading(true)
        setError(false)
        setCartEmpty(false)
        setCartItems([])
        try {
            const response = await fetch(`https://thinsil-backend.onrender.com/cart/getCartItems/${email}`)
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok' && data.cartItems.length) {
                data.cartItems.forEach(async (productId) => {
                    await fetchProducts(productId)
                })
            } else if (data.status === 'ok' && !data.cartItems.length) {
                setCartEmpty(true)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setError(true)
        }
    }, [email])

    useEffect(() => {
        fetchCartItems()
    }, [fetchCartItems])

    //This function is used to add or remove a product from the cart
    const addRemoveCartItem = async (operation, productId) => {
        setButtonSpinner(true)
        const response = await fetch(`https://thinsil-backend.onrender.com/cart/${operation}`, {
            method: 'PATCH',
            body: JSON.stringify({ email, productId }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const data = await response.json()
        if (data.status === 'ok') {
            await fetchCartItems()
        }
        setButtonSpinner(false)
    }


    return (
        <Fragment>
            <div className="fixed top-16 w-full bg-white pt-3 pb-3 pl-4">
                {/*This button is used to navigate to the home page */}
                <button type='button' className=" bg-green-500 text-white font-medium rounded-lg pl-2 pr-2 h-8" onClick={() => {
                    navigate('/')
                }}>Home</button>
            </div>

            {/*The code below is used to show an error message when an error occurs */}
            {error && !loading &&
                <div className="fixed top-40 w-full flex flex-col place-items-center">
                    <p >Some error occured.</p>
                    <p className="text-red-500 cursor-pointer" onClick={() => {
                        fetchProducts()
                    }}>Reload</p>
                </div>}

            {/*The code below is used to show a loading spinner when the data is being fetched */}
            {!error && loading &&
                < div className="fixed top-40 w-full flex justify-center" >
                    <div
                        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                        role="status">
                        <span
                            className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                        >Loading...</span
                        >
                    </div>
                </div>}

            {/*The code bleow is used to show cart items if there is no error */}
            {!error && !loading && <div className="w-full pt-32 flex flex-col gap-5 place-items-center">
                {cartEmpty &&
                    /*The p tag  is used to show a message when the cart is empty*/
                    <p className="pt-10">No products available in the cart</p>
                }

                {/*If the cart items are present, the code below is used to show cart items to the user */}
                {cartItems && !cartEmpty && cartItems.length > 0 && cartItems.map(item => {
                    return <div key={Math.random()} className="w-11/12 sm:w-3/4 md:w-2/3 lg:w-5/12 xl-4/12 flex flex-row border-b shadow-xl p-2 ">
                        <div>
                            <img className="w-32 h-32 cursor-pointer" src={item.image} alt='' />
                        </div>
                        <div className="flex flex-col w-96 pl-2 lg:pl-5">
                            <p className="text-xl font-semibold">{item.title}</p>
                            <div className="flex flex-row gap-3 mt-2">
                                <p className=" font-semibold">Price:</p>
                                <p>${item.price}</p>
                            </div>
                            <div className="flex flex-row gap-3">
                                <p className=" font-semibold">Rating:</p>
                                <p>{item.rating.rate}</p>
                            </div>
                            <div className="flex flex-row mt-2 gap-4">
                                <button type='button' className=" bg-red-500 text-white font-medium rounded-lg pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1" onClick={() => {
                                    addRemoveCartItem('remove', item.id)
                                }}>
                                    {buttonSpinner && <div>
                                        <svg aria-hidden="true" className=" w-7 h-6  text-gray-200 animate-spin dark:text-gray-600 fill-gray-900 mt-0.5" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>}
                                    Remove</button>
                                <button type='button' className=" bg-lime-500 text-white font-medium rounded-lg pl-2 pr-2 h-8" >Buy</button>
                            </div>
                        </div>
                    </div>
                })}

            </div>}
        </Fragment>
    )
}
export default Cart