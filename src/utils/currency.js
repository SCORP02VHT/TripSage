// src/utils/currency.js
export const convertToINR = (priceInUSD) => {
    // Assuming 1 USD = 75 INR (you can update this rate)
    const rate = 75;
    const numericPrice = parseFloat(priceInUSD.replace(/[^0-9.]/g, ''));
    return `₹${Math.round(numericPrice * rate)}`;
  };