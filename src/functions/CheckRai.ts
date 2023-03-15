export function checkRai(min : number | null ,max : number | null) : string{
    let result;
    if(!min && !max){
        result = "ไม่จำกัดไร่";
    }
    else if(!min && max){
        result = `เมื่อจ้างไม่เกิน ${max} ไร่`
    }
    else if(min && !max){
        result = `เมื่อจ้างขั้นต่ำ ${min} ไร่`
    }
    else{
        result = `เมื่อจ้างไม่เกิน ${max} ไร่`
    }
    return result;
}

export function checkRaiFull(min : number | null ,max : number | null) : string{
    let result;
    if(!min && !max){
        result = "";
    }
    else if(!min && max){
        result = `เมื่อจ้างไม่เกิน ${max} ไร่`
    }
    else if(min && !max){
        result = `เมื่อจ้างขั้นต่ำ ${min} ไร่`
    }
    else{
        result = `เมื่อจ้างขั้นต่ำ ${min} ไร่ และไม่เกิน ${max} ไร่`
    }
    return result;
}