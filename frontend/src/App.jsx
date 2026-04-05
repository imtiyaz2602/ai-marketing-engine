import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/shared/Sidebar';
import BrandPage from './pages/BrandPage';
import ContentPage from './pages/ContentPage';
import RepurposePage from './pages/RepurposePage';
import AdsPage from './pages/AdsPage';
import SentimentPage from './pages/SentimentPage';
import CalendarPage from './pages/CalendarPage';
import { BrandProvider } from './context/BrandContext';
import './App.css';

function App() {
  return (
    <BrandProvider>
      <Router>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{ flex: 1, marginLeft: '240px', padding: '32px', background: '#f8fafc', minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/brand" replace />} />
              <Route path="/brand" element={<BrandPage />} />
              <Route path="/content" element={<ContentPage />} />
              <Route path="/repurpose" element={<RepurposePage />} />
              <Route path="/ads" element={<AdsPage />} />
              <Route path="/sentiment" element={<SentimentPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </BrandProvider>
  );
}

export default App;
