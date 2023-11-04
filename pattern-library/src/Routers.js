import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Home from './components/home'
import Login from './components/login/login';

const Routers = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
            </Routes>
        </Router>
    );
};

export default Routers;