import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth';
import Home from './pages/Home';
import About from './pages/About';
import { Navbar } from './components/Navbar';
import Recording from './pages/Recording';

const App = ({Component, pageProps}) => {
  return (
    <Router>
      <Navbar/>
      <div>
        <Routes>
          <Route path="/" element={<About />} />
          <Route path ="/About" element={<About />}/>
          <Route path="/Home" element={<Home/>}/>
          <Route path="/Auth" element={<Auth/>}/>
          <Route path="/Recording" element={<Recording/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
