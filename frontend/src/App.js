// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CreatePropertyPage from './pages/CreatePropertyPage';
import AllPropertiesPage from './pages/AllPropertiesPage';
import PropertyDetails from './components/PropertyDetails';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from './components/AuthContext';
import { SROOfficeFormPage, NotaryOfficeFormPage, LandRevenueOfficeFormPage } from './pages/pageIndex';
import AuthCheck from './components/AuthCheck';


function App() {
  const { onLogin, isLoggedIn, onLogout } = useAuth();


  return (
    <>


      <Router>
        <Routes>
          <Route path="/" element={<AuthCheck />} />
          <Route path="/landing/:isRegistered/:isLogged" element={<LandingPage />} />

          <Route path="/createProperty" element={<CreatePropertyPage />} />
          <Route
            path="/showProperty"
            element={<AllPropertiesPage />}
          />
          <Route path="/propertyDetails/:id" element={<PropertyDetails />} />
          <Route
            path="/registerYourself"
            element={<SignupPage />}
          />
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/sroOfficeFrom"
            element={<SROOfficeFormPage />}
          />
          <Route
            path="/notaryOfficeForm"
            element={<NotaryOfficeFormPage />}
          />
          <Route
            path="/landRevenueOffice"
            element={<LandRevenueOfficeFormPage />}
          />
        </Routes>
      </Router>

    </>
  );
}

export default App;

