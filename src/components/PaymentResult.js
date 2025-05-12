import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentResult.css';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handlePaymentResult = async () => {
      setLoading(true);
      try {
        // Always get invoiceNo from localStorage
        const invoiceNo = localStorage.getItem('lastInvoiceNo');
        if (!invoiceNo) {
          setResult({
            respCode: '9999',
            respDesc: 'No invoice number found',
            isSuccess: false
          });
          return;
        }
        // Perform payment inquiry
        const response = await fetch(`http://localhost:5000/api/payment-inquiry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ invoiceNo })
        });
        const data = await response.json();
        setResult({
          ...data,
          isSuccess: data.respCode === '0000'
        });
        // Optionally clear the invoice number after use
        localStorage.removeItem('lastInvoiceNo');
      } catch (error) {
        console.error('Error processing payment result:', error);
        setResult({
          respCode: '9999',
          respDesc: 'Error processing payment result',
          errorDetails: 'An unexpected error occurred. Please try again.',
          isSuccess: false
        });
      } finally {
        setLoading(false);
      }
    };
    handlePaymentResult();
  }, []);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleRetryPayment = () => {
    navigate('/');
  };

  if (loading) {
    return <div className="payment-result loading">Loading...</div>;
  }

  if (!result) {
    return <div className="payment-result error">No payment result found</div>;
  }

  return (
    <div className={`payment-result ${result.isSuccess ? 'success' : 'error'}`}>
      <h2>{result.isSuccess ? 'Payment Successful' : 'Payment Failed'}</h2>
      <div className="result-details">
        <p><strong>Status:</strong> {result.respDesc}</p>
        <p><strong>Amount:</strong> {result.amount} {result.currencyCode}</p>
        <p><strong>Invoice No:</strong> {result.invoiceNo}</p>
        {result.errorDetails && (
          <div className="error-details">
            <p><strong>Additional Information:</strong></p>
            <p>{result.errorDetails}</p>
          </div>
        )}
      </div>
      <div className="action-buttons">
        <button onClick={handleBackToHome}>Back to Home</button>
        {!result.isSuccess && (
          <button onClick={handleRetryPayment} className="retry-button">
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentResult; 