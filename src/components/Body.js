
import { Fragment, useEffect, useState, useCallback } from "react"
import ProductCard from "./ProductCard";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AlertModal from "./AlertModal";

function Body() {
    const navigate = useNavigate()
    const [products, setProducts] = useState() //This state contains all the products we fetch from the api
    const [categories, setCategories] = useState() //This state contains all the categories
    const [loading, setLoading] = useState(true) //This state is used to manage loading when products are being fetched
    const [error, setError] = useState(false) //This state is used to manage errors that occur while fetching photos
    const [selectedCategory, setSelectedCategory] = useState() //This state is used to select a particular categary and fetch products of that particular category
    const [cartItems, setCartItems] = useState([]) //This state stores all the products to be stored in the cart
    const [alertModal, setAlertModal] = useState(false) //This state is used to show an error modal when an error occurs
    const email = localStorage.getItem('thinsil_email') //This variable is used to store the email which is being logged in

    //This function is used to fetch all the categories
    const fetchCategories = useCallback(async () => {
        try {
            const response = await fetch('https://fakestoreapi.com/products/categories')
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            setCategories(data)
        } catch (error) {
            setLoading(false)
            setError(true)
        }
    }, [])

    //This function is used to fetch all the products stored in the cart from the database
    const fetchCartItems = useCallback(async () => {
        try {
            const response = await fetch(`https://thinsil-backend.onrender.com/cart/getCartItems/${email}`)
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            if (data.status === 'ok') {
                setCartItems(data.cartItems)
            }
        } catch (error) {
            setLoading(false)
            setError(true)
        }
    }, [email])


    //This function is used to fetch products
    const fetchProducts = useCallback(async () => {
        setLoading(true)
        setError(false)
        try {
            const response = await fetch(`https://fakestoreapi.com/products${selectedCategory ? `/category/${selectedCategory}` : ''}`)
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            setLoading(false)
            setProducts(data)
        } catch (error) {
            setLoading(false)
            setError(true)
        }
    }, [selectedCategory])

    useEffect(() => {
        fetchProducts()
        fetchCategories()
        fetchCartItems()
    }, [fetchProducts, fetchCartItems, fetchCategories])

    return (
        <Fragment>
            {/*The code below is used to show an alert modal */}
            {!error && !loading && alertModal && <AlertModal message={'Some error occured. Try again.'} type={'warning'} alertModalRemover={() => setAlertModal(false)} />}

            {/*The code below is used to show an error message if an error occurs while fetching images */}
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

            {/*The code below is used to show a message when no products are available after successful fetching of data */}
            {!error && !loading && products && !products.length &&
                <div className="fixed top-44 w-full flex flex-col place-items-center">
                    <p>No products found.</p>
                </div>}

            {!error && <div className="w-full fixed top-12 pt-9 pb-4 flex flex-row justify-between items-center bg-white">
                {/*This select tag is used to show a dropdown for categories */}
                <select defaultValue='category' className="cursor-pointer border-2 border-gray-500 rounded-md text-lg font-medium bg-white ml-4" name="category" id="category" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                    <option disabled value='category'>Category</option>
                    {categories && categories.length && categories.map(category => {
                        return <option key={Math.random()} value={category}>{category}</option>
                    })}
                    <option value=''>none</option>
                </select>

                {/*The code below is used to show the cart logo  onClick={cartItems.length ? navigate('/cart') : null}*/}
                <div className="relative mr-4  flex flex-row cursor-pointer" onClick={(e) => {
                    if (cartItems.length) {
                        navigate('/cart')
                    }
                }}>
                    <p className="absolute -top-6 left-4 text-2xl font-semibold text-red-600">{cartItems.length ? cartItems.length : ''}</p>
                    <FaShoppingCart className=" fill-gray-500 text-4xl h-full " />
                    <p className=" text-xl font-semibold text-gray-500 pt-2 pl-1">cart</p>
                </div>
            </div>}

            {/*The code blow is used to show the fetched products in cards after successful fetching of products */}
            {!error && !loading && <div className={`mt-32 pt-2 z-10 w-full pb-10 flex flex-wrap flex-row gap-10 place-content-center ${alertModal ? 'blur' : ''}`}>
                {products && products.length && products.map(product => <ProductCard product={product} cartItems={cartItems} fetchCartItems={fetchCartItems} alertModalSetter={() => setAlertModal(true)} key={product.id} />)}
            </div>}
        </Fragment>
    )
}
export default Body