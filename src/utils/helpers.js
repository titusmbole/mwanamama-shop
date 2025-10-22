export const BASE_URL = 'https://api.mwanamama.org/api/v1';
export const BASE = 'https://api.mwanamama.org';

export const SOCKET_BASE_URL="http://localhost:4850/ws"
export const getMpesaStatusMessage = (resultCode, resultDesc) => {
  const statusMap = {
    0: { status: 'SUCCESS', message: 'Payment completed successfully!', variant: 'success' },
    1: { status: 'PENDING', message: 'Payment is being processed...', variant: 'info' },
    4999: { status: 'PENDING', message: 'The transaction is still under processing', variant: 'info' },
    1032: { status: 'CANCELLED', message: 'Payment was cancelled by user.', variant: 'warning' },
    1037: { status: 'FAILED_INSUFFICIENT_FUNDS', message: 'Insufficient funds.', variant: 'danger' },
    1031: { status: 'FAILED_TIMEOUT', message: 'Payment timed out. Please try again.', variant: 'warning' },
    1035: { status: 'FAILED_INVALID_PIN', message: 'Invalid PIN entered.', variant: 'danger' },
  };

  return statusMap[resultCode] || { status: 'FAILED', message: resultDesc || 'Payment failed.', variant: 'danger' };
};
