import React, { useState } from 'react';
import './PaymentForm.css';

const PaymentForm = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('SGD');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://2c2p-backend-production.up.railway.app';
      const response = await fetch(`${API_URL}/api/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'omit',
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
        }),
      });

      if (!response.ok) {
        if (response.status === 502) {
          throw new Error('Payment service is temporarily unavailable. Please try again later.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || `Payment failed with status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.paymentUrl) {
        // Store invoiceNo in localStorage
        if (data.invoiceNo) {
          localStorage.setItem('lastInvoiceNo', data.invoiceNo);
        }
        // Redirect to 2C2P payment page
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('Payment URL not received');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form-container">
      <h2>Make a Payment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label htmlFor="currency">Currency:</label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="SGD">SGD</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm; 