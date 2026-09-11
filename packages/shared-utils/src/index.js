// Shared utility functions

function formatPKR(amount) {
  return `Rs. ${Number(amount).toLocaleString('en-PK')}`;
}

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

module.exports = { formatPKR, isValidEmail };
