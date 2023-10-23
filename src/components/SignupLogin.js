
import { Fragment, useState } from "react"
import * as EmailValidator from 'email-validator';
import AlertModal from "./AlertModal";
import { useNavigate } from "react-router-dom";

//This component is the login-signup form
function SignupLogin() {
    const [email, setEmail] = useState('') //This state stores the email provided by the user
    const [password, setPassword] = useState('') //This state stores the password provided by the user
    const [emailValid, setEmailValid] = useState(true) //This state is true when if the email provided by the user is valid, and vice-versa
    const [passwordValid, setPasswordValid] = useState(true) //This state is true when if the password provided by the user is valid, and vice-versa
    const [isLogin, setIsLogin] = useState(true) //This state is true when if the user want to login, and is false if the user wants to signup
    const [buttonSpinner, setButtonSpinner] = useState(false) //This state is used to show a spinner when the user is trying to login or signup
    const [alertMessage, setAlertMesssage] = useState() //This state is used set message in the alert modal
    const [alertType, setAlertType] = useState() //This state is used set alert type in the alert modal
    const [alertModal, setAlertModal] = useState(false) //This state is used to show the alert mdoal if an error occurs
    const navigate=useNavigate()

    //This function is used to login or signup 
    const loginOrSignup = async (e) => {
        e.preventDefault()
        if (!email || !password || !EmailValidator.validate(email) || password.trim().length < 6) {
            return
        }
        setButtonSpinner(true)
        try {
            const response = await fetch(`https://thinsil-backend.onrender.com/user/${isLogin ? 'login' : 'signup'}`, {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (!response.ok) {
                throw new Error('Some error occured')
            }
            const data = await response.json()
            setButtonSpinner(false)
            if (data.status === 'noContent') {
                setAlertMesssage('Provide email and password')
                setAlertType('warning')
                setAlertModal(true)
            } else if (!isLogin && data.status === 'emailExists') {
                setAlertMesssage('The email already exists')
                setAlertType('warning')
                setAlertModal(true)
            } else if (isLogin && data.status === 'invalidUser') {
                setAlertMesssage('No user with the email exists')
                setAlertType('warning')
                setAlertModal(true)
            } else if (isLogin && data.status === 'invalidPassword') {
                setAlertMesssage('Provide correct password')
                setAlertType('warning')
                setAlertModal(true)
            } else if (data.status === 'ok') {
                localStorage.setItem('thinsil_authToken', data.authToken)
                localStorage.setItem('thinsil_email',email)
                navigate('/')
            } else {
                throw new Error('Some error occured')
            }
        } catch (error) {
            setButtonSpinner(false)
            setAlertMesssage('Some error occured')
            setAlertType('warning')
            setAlertModal(true)
        }
    }

    return (
        <Fragment>
            {/*The code bolow is used to show an alert modal if an error occurs */}
            {alertModal && <AlertModal message={alertMessage} type={alertType} alertModalRemover={() => setAlertModal(false)} />}

            <div className={`w-full h-screen flex justify-center bg-gray-100 ${alertModal ? 'blur' : null}`} >
                <form className="w-11/12 sm:w-96  h-fit p-4 mt-28 flex flex-col rounded-lg border-2 border-gray-200 shadow-2xl bg-white" onSubmit={loginOrSignup}>
                    <label className="text-lg font-semibold mb-1" htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" className="border-2 border-gray-400 p-1 rounded-lg" placeholder="abc@gmail.com" autoComplete="off" value={email}
                        onChange={e => {
                            setEmail(e.target.value.trimEnd())
                            setEmailValid(true)
                        }} onBlur={() => {
                            if (!EmailValidator.validate(email)) {
                                return setEmailValid(false)
                            }
                        }} />
                    {!emailValid && <p className="text-red-500">Enter a valid email.</p>}
                    <label className="text-lg font-semibold mb-1 mt-2" htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" className="border-2 border-gray-400 p-1 rounded-lg" autoComplete="off" value={password}
                        onChange={e => {
                            setPassword(e.target.value.trimEnd())
                            setPasswordValid(true)
                        }} onBlur={() => {
                            if (password.trim().length < 6) {
                                return setPasswordValid(false)
                            }
                        }} />
                    {!passwordValid && <p className="text-red-500">Password should be of atleast 6 characters.</p>}

                    <div className="w-full h-12 flex justify-center mt-4 border-b border-gray-400 ">

                        <button type="submit" className="w-full bg-blue-500 text-white font-medium rounded-lg pl-2 pr-2 pt-0.5 h-8 flex flex-row place-content-center gap-1">
                            {buttonSpinner && <div >
                                <svg aria-hidden="true" className="mt-0.5 w-7 h-6  text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                </svg>
                                <span className="sr-only">Loading...</span>
                            </div>}
                            {isLogin ? 'Sign in' : 'Sign Up'}
                        </button>
                    </div>

                    <div className="w-full  flex justify-center mt-4">
                        <button type='button' className=" bg-lime-500 text-white font-medium rounded-lg pl-2 pr-2 h-8" onClick={() => {
                            setIsLogin(isLogin => !isLogin)
                            setEmail('')
                            setPassword('')
                        }}>{isLogin ? 'Create new account' : 'Sign in with existing account'}</button>
                    </div>
                </form>
            </div>
        </Fragment>
    )
}
export default SignupLogin