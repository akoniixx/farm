import {BASE_URL, httpClient} from '../config/develop-config';

const getAllCropName = async () => {
  return await httpClient
    .get(BASE_URL + '/tasks/crop/crop-name-all')
    .then(res => res.data)
    .catch(err => {
      console.log('err.response :>> ', JSON.stringify(err.response, null, 2));
      throw err;
    });
};

export const cropDatasource = {
  getAllCropName,
};
