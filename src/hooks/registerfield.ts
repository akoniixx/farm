export const initialFormRegisterState = {
    name : "",
    surname : "",
    tel : "",
    no : "",
    address : "",
    province : "",
    district : "",
    subdistrict : "",
    postal : ""
}

export const registerReducer = (state : any,action: any) => {
    switch (action.type) {
        case "Handle Input":
            return {
                ...state,
                [action.field] : action.payload
            }
        default:
            return state
    }
}