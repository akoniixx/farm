export function insertHyphenInTelNumber(telNumber: string): string {
  let formattedTelNumber = '';
  const telNumberLength = telNumber.length;
  for (let i = 0; i < telNumberLength; i++) {
    if (i === 0) {
      formattedTelNumber += telNumber[i];
    } else if (i === 3) {
      formattedTelNumber += `-${telNumber[i]}`;
    } else if (i === 6) {
      formattedTelNumber += `-${telNumber[i]}`;
    } else {
      formattedTelNumber += telNumber[i];
    }
  }

  return formattedTelNumber;
}
