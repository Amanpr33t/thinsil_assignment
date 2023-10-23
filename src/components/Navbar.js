import { Link } from "react-router-dom"
import { Fragment } from "react"
import { useNavigate } from "react-router-dom"

//This component is the navigation bar
function Navbar() {
    const navigate=useNavigate()
    return (
        <Fragment>
            <div className="fixed z-40 top-0 w-full">
                <nav className=" flex flex-row justify-between items-center  h-16 w-full bg-white border-b shadow pl-4 pr-4" >
                    <Link to='/' className='font-semibold text-3xl sm:text-4xl italic text-gray-600' >Thinsil</Link>
                    {localStorage.getItem('thinsil_authToken') && <button className="bg-blue-500 text-white p-2 font-semibold rounded" onClick={() => {
                        localStorage.clear()
                        navigate('/user')
                    }}>Logout</button>}
                </nav>
            </div>
        </Fragment>
    )
}
export default Navbar