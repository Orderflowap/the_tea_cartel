// Generate unique session ID for table+customer
const generateSessionId = (tableNumber, mobileNumber) => {
  return `SESSION-${tableNumber}-${mobileNumber}-${Date.now()}`;
};

// Extract session info from sessionId
const parseSessionId = (sessionId) => {
  const parts = sessionId.split('-');
  return {
    tableNumber: parseInt(parts[1]),
    mobileNumber: parts[2]
  };
};

// Check if session is still active (within 4 hours)
const isSessionActive = (sessionStartTime) => {
  const fourHours = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
  return (Date.now() - new Date(sessionStartTime).getTime()) < fourHours;
};

module.exports = {
  generateSessionId,
  parseSessionId,
  isSessionActive
};