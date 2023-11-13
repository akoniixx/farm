import { BASE_URL, httpClient } from '../config/develop-config';
import crashlytics from '@react-native-firebase/crashlytics';
const getTargetSpray = async () => {
  return await httpClient
    .get(BASE_URL + '/tasks/target-spray/find-target-spray-on-task')
    .then(response => {
      return response.data;
    })
    .catch(error => {
      crashlytics().recordError(error);
      crashlytics().setAttributes({
        url: BASE_URL + '/tasks/target-spray',
      });
      throw error;
    });
};

export const targetSprayDatasource = {
  getTargetSpray,
};
