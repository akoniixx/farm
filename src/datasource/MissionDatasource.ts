import {BASE_URL, httpClient} from '../config/develop-config';

const getListMissions = async (payload: {
  dronerId: string;
  page: number;
  take: number;
}) => {
  return httpClient
    .get(BASE_URL + '/promotion/droner-mission/getdronermission', {
      params: {
        ...payload,
      },
    })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};
export const missionDatasource = {
  getListMissions,
};
