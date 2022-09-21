export const registerReducer = (state : any,action: any) => {
    switch (action.type) {
        case "Initial Input":
            return {
                name : action.name,
                surname : action.surname,
                birthDate : action.birthDate,
                tel : action.tel,
                no : action.no,
                address : action.address,
                province : action.province,
                district : action.district,
                subdistrict : action.subdistrict,
                postal : action.postal
            }
        case "Handle Input":
            return {
                ...state,
                [action.field] : action.payload
            }
        default:
            return state
    }
}