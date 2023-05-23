import { BASE_URL, httpClient } from '../config/develop-config';
import { ReviewDroner } from '../entites/MyJobsEntites';
import { SearchMyJobsEntites } from '../entites/SearchMyJobsEntites';

export class MyJobDatasource {
  static async getMyJobsList(params: SearchMyJobsEntites): Promise<any> {
    return httpClient
      .post(BASE_URL + '/tasks/my-jobs/search-my-jobs', params)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static getReceivePoint = (taskId: string): Promise<any> => {
    return httpClient
      .get(
        BASE_URL + '/tasks/task-estimate-point/finish-estimate-point/' + taskId,
      )
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err;
      });
  };

  static async submitReview(
    taskId: string,
    canReview: 'Yes' | 'No',
    pilotEtiquette: number,
    punctuality: number,
    sprayExpertise: number,
    comment: string,
    updateBy: string,
  ): Promise<any> {
    const params = {
      taskId: taskId,
      canReview: canReview,
      pilotEtiquette: pilotEtiquette,
      punctuality: punctuality,
      sprayExpertise: sprayExpertise,
      comment: comment,
      updateBy: updateBy,
    };
    return httpClient
      .post(BASE_URL + '/tasks/task/review-droner', params)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err;
      });
  }
}
