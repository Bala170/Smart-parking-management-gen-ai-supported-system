import { paymentTransactions, activeParkingSession } from '../data/mockData';

let transactionsState = [...paymentTransactions];

export const paymentService = {
  // GET /api/payments
  async getTransactions() {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return [...transactionsState];
  },

  // POST /api/payment/create
  async processPayment(paymentData) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newTxn = {
      id: `TXN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      sessionId: paymentData.sessionId || activeParkingSession.sessionId,
      date: new Date().toLocaleString(),
      amount: paymentData.amount || activeParkingSession.currentFee,
      method: paymentData.method || 'UPI',
      vehicle: paymentData.vehicle || activeParkingSession.vehicleNumber,
      status: 'SUCCESS',
      receiptNo: `RCP-${Math.floor(1000 + Math.random() * 9000)}-S`,
    };

    transactionsState = [newTxn, ...transactionsState];
    return {
      success: true,
      transaction: newTxn,
      message: 'Payment verified and parking charges cleared successfully.',
    };
  }
};
