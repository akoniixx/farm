export const checkService = (min: number | null, max: number | null) => {
  if (!min && !max) {
    return 'ค่าบริการขั้นต่ำ XX บาท';
  } else if (min && !max) {
    return `ค่าบริการขั้นต่ำ ${min} บาท`;
  } else if (!min && max) {
    return `ค่าบริการต้องไม่เกิน ${max} บาท`;
  } else {
    return `ค่าบริการขั้นต่ำ ${min} บาทและไม่เกิน ${max} บาท`;
  }
};
