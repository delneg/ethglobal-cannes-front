import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreateWalletPage from './pages/CreateWalletPage';
import RecoverPage from './pages/RecoverPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateWalletPage />} />
        <Route path="/recover" element={<RecoverPage />} />
      </Routes>
    </Router>
  );
}

export default App;
