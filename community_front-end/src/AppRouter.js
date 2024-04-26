import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/" element={<Login/>} /> {/* Default route, e.g., for the home page */}
            </Routes>
        </Router>
    );
};

export default AppRouter;