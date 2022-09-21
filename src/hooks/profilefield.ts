export const initProfileState = {
    name : "",
    id : "",
    image : "",
    droneitem : [],
    status : "",
    totalRevenue : 0
}

export const profileReducer = (state : any,action :any)=>{
    switch (action.type) {
        case "InitProfile":
            return {
                name : action.name,
                id : action.id,
                image : action.image,
                droneitem : action.droneitem,
                status : action.status,
                totalRevenue : action.totalRevenue
            }
    
        default:
            return state
    }
}