const checkDecimal = (value: number): string => {
  const regex = /^[0-9]+$/;
  if (regex.test(`${value}`)) {
    return value.toString();
  } else {
    return Number(value).toFixed(2);
  }
};
export {checkDecimal};
