import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router'; // Use 'react-router-dom' here
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnBoardingPage';
import HomePage from './pages/HomePage';
import PrivateRoute from './components/PrivateRoutes';

import NotificationsPage from './pages/NotificationPage';
import FriendPage from './pages/FriendPage';
import Layout from './components/Layout';
import ChatPage from './pages/ChatPage';

const App = () => {
  return (
    <div className="h-screen">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<PrivateRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Protected Layout Wrapper */}
            <Route element={<Layout showSidebar={true}  />}>
              <Route path="/" element={<HomePage />} />
            </Route>
            <Route element={<Layout showSidebar={true}/>}>
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
            <Route element={<Layout showSidebar={true}/>}>
              <Route path="/friends" element={<FriendPage />} />
            </Route>
            <Route element={<Layout showSidebar={false}/>}>
              <Route path="/chat/:id" element={<ChatPage />} />
            </Route>
            
          </Route>
        </Routes>
      </BrowserRouter>

      
    </div>
  );
};

export default App;
