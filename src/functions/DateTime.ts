export const monthArray = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

export function generateTime(date: string): string {
  const datetimesplit = date.split('T');
  const datesplit = datetimesplit[0].split('-');
  return `${datesplit[2]} ${monthArray[parseInt(datesplit[1]) - 1]} ${
    (parseInt(datesplit[0]) + Number(543)) % 100
  }`;
}

export function generateYearTime(date: string): string {
  const datetimesplit = date.split('T');
  const datesplit = datetimesplit[0].split('-');
  return `${datesplit[2]} ${monthArray[parseInt(datesplit[1]) - 1]} ${
    parseInt(datesplit[0]) + Number(543)
  }, ${parseInt(datetimesplit[1].split(':')[0]) + 7}:${
    datetimesplit[1].split(':')[1]
  } น.`;
}
