import { BASE_URL, httpClient, registerClient } from '../config/develop-config';

export class DronerDatasource {
  static getDronerData(dronerId: string) {
    return httpClient
      .get(BASE_URL + `/droner/${dronerId}`)
      .then(res => res.data)
      .catch(err => console.log(err));
  }
  static getDronerProfileImage(path: string) {
    return httpClient
      .get(BASE_URL + `/file/geturl?path=${path}`)
      .then(res => res.data.url)
      .catch(err => console.log(err));
  }
  static getDronerRating(dronerId: string) {
    return httpClient
      .get(BASE_URL + `/tasks/task/summary-review-droner/${dronerId}`)
      .then(res => res.data)
      .catch(err => console.log(err));
  }
  static async getDronerNearMe({ lat, long }: { lat: number; long: number }) {
    return registerClient
      .post(BASE_URL + '/tasks/task-suggestion/droner-suggestion-not-login', {
        lat,
        long,
        page: 1,
        take: 8,
        dateAppointment: new Date().toISOString(),
      })
      .then(res => res.data)
      .catch(err => console.log(err));
  }
}
