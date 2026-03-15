// ===== NEW FILE CREATED FOR CUSTOMER PROFILE FEATURE =====
/**
 * Format dateOfBirth for display (dd/MM/yyyy)
 * @param {string|Date} value - ISO date string or Date
 * @returns {string}
 */
export const formatDateOfBirth = (value) => {
  if (!value) return 'Chưa cập nhật';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return 'Chưa cập nhật';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
