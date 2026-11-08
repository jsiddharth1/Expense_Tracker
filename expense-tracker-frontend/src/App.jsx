import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ExpenseProvider } from './context/ExpenseContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ImportModal from './components/ImportModal';
import AuthPromptModal from './components/AuthPromptModal';

const App = () => {
    return (
        <AuthProvider>
            <ExpenseProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                    <ImportModal />
                    <AuthPromptModal />
                </Router>
            </ExpenseProvider>
        </AuthProvider>
    );
};

export default App;
