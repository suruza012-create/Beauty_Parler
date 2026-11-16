const isSslCommerzConfigured = () => Boolean(process.env.SSLCOMMERZ_STORE_ID && process.env.SSLCOMMERZ_STORE_PASSWORD);

const getBaseUrl = () => process.env.SSLCOMMERZ_IS_LIVE === 'true'
  ? 'https://securepay.sslcommerz.com'
  : 'https://sandbox.sslcommerz.com';

const getCredentials = () => ({
  store_id: process.env.SSLCOMMERZ_STORE_ID,
  store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD
});

const readJsonResponse = async response => {
  if (!response.ok) throw new Error(`SSLCommerz returned HTTP ${response.status}`);
  return response.json();
};

const createSslCommerzSession = async parameters => {
  if (!isSslCommerzConfigured()) throw new Error('SSLCommerz credentials are missing');
  const body = new URLSearchParams({ ...getCredentials(), ...parameters });
  const response = await fetch(`${getBaseUrl()}/gwprocess/v4/api.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
    signal: AbortSignal.timeout(20000)
  });
  return readJsonResponse(response);
};

const validateSslCommerzPayment = async validationId => {
  if (!isSslCommerzConfigured()) throw new Error('SSLCommerz credentials are missing');
  const query = new URLSearchParams({
    ...getCredentials(),
    val_id: validationId,
    format: 'json'
  });
  const response = await fetch(`${getBaseUrl()}/validator/api/validationserverAPI.php?${query}`, {
    signal: AbortSignal.timeout(20000)
  });
  return readJsonResponse(response);
};

const isValidSslCommerzTransaction = (validation, payment) => {
  const status = String(validation.status || '').toUpperCase();
  if (!['VALID', 'VALIDATED'].includes(status)) return { valid: false, reason: 'Provider did not validate the transaction' };
  if (String(validation.tran_id || '') !== payment.transactionId) return { valid: false, reason: 'Transaction id mismatch' };
  if (String(validation.currency_type || '').toUpperCase() !== 'BDT') return { valid: false, reason: 'Currency mismatch' };

  const actualAmount = Number(validation.currency_amount || validation.amount);
  if (!Number.isFinite(actualAmount) || Math.abs(actualAmount - payment.amount) >= 0.01) {
    return { valid: false, reason: 'Amount mismatch' };
  }
  if (Number(validation.risk_level) === 1) return { valid: true, requiresReview: true };
  return { valid: true, requiresReview: false };
};

module.exports = {
  isSslCommerzConfigured,
  createSslCommerzSession,
  validateSslCommerzPayment,
  isValidSslCommerzTransaction
};