import { BASE_URL, httpClient } from '../config/develop-config';
import { SearchMyJobsEntites } from '../entites/SearchMyJobsEntites';

export class MyJobDatasource {
  static getMyJobsList(params: SearchMyJobsEntites): Promise<any> {
    return httpClient
      .post(BASE_URL + '/tasks/my-jobs/search-my-jobs', (params))
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw (err)
      });
  }
}
