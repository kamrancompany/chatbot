import React from 'react';
import Chatbot from './components/Chatbot';
import Automessenger from './components/Automessenger';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignIn from './components/SignIn'
import PrivateComponent from './components/PrivateComponent'
import ForgetPasswordEmail from './components/ForgetPasswordEmail';
import OtpScreen from './components/OtpScreen';
import ResetPassword from './components/ResetPassword';


function App() {
  return (
    <BrowserRouter> {/* Wrap the entire application with BrowserRouter */}
      <Navbar />
      <Routes>
        <Route element ={<PrivateComponent/>}>
        <Route path="/" element={<Chatbot />} />
        <Route path="/auto" element={<Automessenger />} />
        </Route>
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/forget" element={<ForgetPasswordEmail/>}/>
        <Route path='/otp' element={<OtpScreen/>}/>
        <Route path='/reset-pass' element={<ResetPassword/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
