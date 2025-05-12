import React, { useState } from 'react';
import './PaymentForm.css';

const PaymentForm = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('THB');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency,
        }),
      });

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
            {/* <option value="THB">THB</option>
            <option value="USD">USD</option> */}
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