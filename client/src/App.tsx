import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnBoardingPage'
import HomePage from './pages/HomePage'
import PrivateRoute from './components/PrivateRoutes'

const App = () => {
  return (
    <>
    <div className='h-screen'>
      <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route element={<PrivateRoute/>}>
        <Route path='/onboarding' element={<OnboardingPage />} />
        <Route path='/' element={<HomePage />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </div>
    </>
  )
}

export default App