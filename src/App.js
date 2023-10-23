import Navbar from './components/Navbar';
import SignupLogin from './components/SignupLogin';
import Body from './components/Body';
import Cart from './components/Cart';
import ProductOverview from './components/ProductOverview';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate()
  const authToken = localStorage.getItem('thinsil_authToken')
  useEffect(() => {
    if (!authToken) {
      navigate('/user')
    }
  }, [authToken, navigate])

  return (
    <div className="box-border w-full min-h-screen">
      <Navbar />
      <Routes>
        <Route path='/' element={<Body />}></Route>
        <Route path='/user' element={<SignupLogin />}></Route>
        <Route path='/cart' element={<Cart />}></Route>
        <Route path='/product' element={<ProductOverview />}></Route>
        <Route path='*' element={<Navigate replace to='/' />}></Route>
      </Routes>
    </div>
  );
}

export default App


