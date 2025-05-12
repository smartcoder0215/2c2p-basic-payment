import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import PaymentForm from './components/PaymentForm';
import PaymentResult from './components/PaymentResult';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>2C2P Payment Integration</h1>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<PaymentForm />} />
            <Route path="/payment-result" element={<PaymentResult />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
