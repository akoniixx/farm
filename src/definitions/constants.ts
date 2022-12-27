export const MIN_MS = 60000;

export const ANDROID_DISPLAY = Object.freeze({
  default: 'default',
  spinner: 'spinner',

  // NOTE: the following are exposed, but the native module instead uses "default"
  clock: 'clock',
  calendar: 'calendar',
});

export const EVENT_TYPE_SET = 'set';
export const EVENT_TYPE_DISMISSED = 'dismissed';
export const ANDROID_EVT_TYPE = Object.freeze({
  set: EVENT_TYPE_SET,
  dismissed: EVENT_TYPE_DISMISSED,
  neutralButtonPressed: 'neutralButtonPressed',
});

export const IOS_DISPLAY = Object.freeze({
  default: 'default',
  spinner: 'spinner',
  compact: 'compact',
  inline: 'inline',
});

const COMMON_MODES = Object.freeze({
  date: 'date',
  time: 'time',
});

export const ANDROID_MODE = COMMON_MODES;

export const WINDOWS_MODE = COMMON_MODES;

export const IOS_MODE = Object.freeze({
  ...COMMON_MODES,
  datetime: 'datetime',
  countdown: 'countdown',
});


export const DAY_OF_WEEK = Object.freeze({
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
});

// export const _monthName = [
//   'มกราคม',
//   'กุมภาพันธ์',
//   'มีนาคม',
//   'เมษายน',
//   'พฤษภาคม',
//   'มิถุนายน',
//   'กรกฎาคม',
//   'สิงหาคม',
//   'กันยายน',
//   'ตุลาคม',
//   'พฤศจิกายน',
//   'ธันวาคม',
// ];
export function buildDate(date : number){
  return date < 10 ? '0' + date: date;
}

export function build12Year(year : number){
  let num = [];
  let result = year;
  for(let i=0;i<100;i++){
      num.push(result)
      result -= 1;
  }
  return num.reverse()
}

 export const _monthName = [
  { key: 1, value: "มกราคม" },
  { key: 2, value: "กุมภาพันธ์" },
  { key: 3, value: "มีนาคม" },
  { key: 4, value: "เมษายน" },
  { key: 5, value: "พฤษภาคม" },
  { key: 6, value: "มิถุนายน" },
  { key: 7, value: "กรกฎาคม" },
  { key: 8, value: "สิงหาคม" },
  { key: 9, value: "กันยายน" },
  { key: 10, value: "ตุลาคม" },
  { key: 11, value: "พฤศจิกายน" },
  { key: 12, value: "ธันวาคม" },
]


export const DATE_SET_ACTION = 'dateSetAction';
export const TIME_SET_ACTION = 'timeSetAction';
export const DISMISS_ACTION = 'dismissedAction';

export const NEUTRAL_BUTTON_ACTION = 'neutralButtonAction';
