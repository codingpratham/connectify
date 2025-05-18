import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnBoardingPage'
import HomePage from './pages/HomePage'

const App = () => {
  return (
    <>
    <div className='h-screen'>
      <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/onboarding' element={<OnboardingPage />} />
        <Route path='/' element={<HomePage />} />
      </Routes>
      </BrowserRouter>
    </div>
    </>
  )
}

export default App