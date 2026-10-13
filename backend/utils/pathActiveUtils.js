/** Paths.IsActive: 1 = hiển thị cho học viên, 0 = ẩn */
function toPathIsActiveBit(value, defaultValue = 1) {
  if (value === true || value === 1 || value === '1') return 1;
  if (value === false || value === 0 || value === '0') return 0;
  return defaultValue;
}

module.exports = {
  toPathIsActiveBit,
};
