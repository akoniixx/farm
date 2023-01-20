export const formatNumberWithComma = (
  number: number | string,
  toFixed = false,
) => {
  const convertToNumber = Number(number);
  if (toFixed) {
    return convertToNumber.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return convertToNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
