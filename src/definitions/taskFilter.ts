export const sortField = [
  {
    name: 'ใกล้ถึงวันงาน',
    value: 'coming_task',
    direction: '',
  },
  {
    name: 'ค่าบริการต่ำ-สูง',
    value: 'total_price',
    direction: 'ASC',
  },
  {
    name: 'ค่าบริการสูง-ต่ำ',
    value: 'total_price',
    direction: 'DESC',
  },
  {
    name: 'งานนัดหมายล่าสุด',
    value: 'date_appointment',
    direction: '',
  },
];

export const sortFieldFinish = [
  {
    name: 'งานล่าสุด',
    value: 'date_appointment',
    direction: '',
  },
  {
    name: 'ค่าบริการต่ำ-สูง',
    value: 'total_price',
    direction: 'ASC',
  },
  {
    name: 'ค่าบริการสูง-ต่ำ',
    value: 'total_price',
    direction: 'DESC',
  },
];

export const sortStatusInprogress = [
  {
    name: 'สถานะทั้งหมด',
    value: 'ALL',
  },
  {
    name: 'รอนักบินรับงาน',
    value: 'WAIT_RECEIVE',
  },
  {
    name: 'รอเริ่มงาน',
    value: 'WAIT_START',
  },
  {
    name: 'กำลังบินฉีดพ่น',
    value: 'IN_PROGRESS',
  },
];

export const sortStatusFinish = [
  {
    name: 'สถานะทั้งหมด',
    value: 'ALL',
  },
  {
    name: 'ถูกยกเลิก',
    value: 'CANCELED',
  },
  {
    name: 'รอรีวิว',
    value: 'WAIT_REVIEW',
  },
  {
    name: 'เสร็จสิ้น',
    value: 'DONE',
  },
];
