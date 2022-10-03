import AsyncStorage from "@react-native-async-storage/async-storage";

const date = new Date()
export enum CalendarMode{
    Calendar,
    Month,
    Year
}

export function buildDate(date : number){
    return date < 10 ? '0' + date: date;
}

export function build12Year(year : number){
    let num = [];
    let result = year;
    for(let i=0;i<12;i++){
        num.push(result)
        result -= 1;
    }
    return num.reverse()
}

export const _monthNumber = [
    "01","02","03","04","05","06","07","08","09","10","11","12"
]

export const _monthName = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม'
]

export const CalendarReducer = (state : any,action :any) => {
    switch (action.type) {
        case "ChangeMode":
            return {
                ...state,
                mode : action.mode
            }
        case "ChangeDate": 
            return{
                ...state,
                dateCurrent : action.date,
                highlight : true
            }
        case "ChangeMonth":
            return {
                ...state,
                mode : CalendarMode.Calendar,
                dateCurrent : `${state.yearCurrent}-${_monthNumber[action.month]}-01`,
                monthCurrent : action.month,
                highlight : false
            }
        case "ArrowLeft":
            {
            if(state.monthCurrent === 0){
                return{
                    ...state,
                    monthCurrent : 11,
                    yearCurrent : state.yearCurrent-1,
                    dateCurrent : `${state.yearCurrent-1}-${11}-01`,
                    highlight : false
                }
            }
            else{
                return{
                    ...state,
                    monthCurrent : state.monthCurrent-1,
                    dateCurrent : `${state.yearCurrent}-${_monthNumber[state.monthCurrent-1]}-01`,
                    highlight : false
                }
            }
        }
        case "ArrowRight":{
            if(state.monthCurrent === 11){
                return{
                    ...state,
                    monthCurrent : 0,
                    yearCurrent : state.yearCurrent+1,
                    dateCurrent : `${state.yearCurrent+1}-01-01`,
                    highlight : false
                }
            }
            else{
                return{
                    ...state,
                    monthCurrent : state.monthCurrent+1,
                    dateCurrent : `${state.yearCurrent}-${_monthNumber[state.monthCurrent+1]}-01`,
                    highlight : false
                }
            }
        }
        case "ChangeRangeArrowLeftYear":
            return {
                ...state,
                yearArray : build12Year(state.yearArray[11]-12)
            }
        case "ChangeRangeArrowRightYear":
            return {
                ...state,
                yearArray : build12Year(state.yearArray[11]+12)
            }
        case "ChangeYear":
            return {
                ...state,
                mode : CalendarMode.Calendar,
                dateCurrent : `${action.year}-${_monthNumber[state.monthCurrent]}-01`,
                yearCurrent : action.year,
                highlight : false
            }
    
        default:
            return state
    }
}