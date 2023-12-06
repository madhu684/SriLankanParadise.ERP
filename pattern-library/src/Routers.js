import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Home from './components/home'
import Login from './components/login';
import Registration from './components/registration';

const Routers = () => {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/registration' element={<Registration />} />
            </Routes>
        </Router>
    );
};

export default Routers;