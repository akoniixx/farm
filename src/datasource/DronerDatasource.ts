import { BASE_URL, httpClient } from '../config/develop-config';

export class DronerDatasource{
    static getDronerData(dronerId : string){
        return httpClient.get(BASE_URL + `/droner/${dronerId}`)
            .then(
                res => res.data
            )
            .catch(err => console.log(err))
    }
    static getDronerProfileImage(path : string){
        return httpClient.get(BASE_URL + `/file/geturl?path=${path}`)
        .then(
            res => res.data.url
        )
        .catch(err => console.log(err))
    }
    static getDronerRating(dronerId : string){
        return httpClient.get(BASE_URL + `task/summary-review-droner/${dronerId}`)
        .then(
            res => res.data
        )
        .catch(err => console.log(err))
    }
}
