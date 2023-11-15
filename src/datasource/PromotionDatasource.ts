import {BASE_URL, httpClient} from '../config/develop-config';
import crashlytics from '@react-native-firebase/crashlytics';
const getHighlight = async ({
  application = 'DRONER',
}: {
  application?: 'FARMER' | 'DRONER';
}) => {
  return httpClient
    .get(
      BASE_URL +
        '/promotion/highlight-news/get-highlight-news?application=' +
        application,
    )
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log(err, 'err getHighlight');
      crashlytics().recordError(err);
      crashlytics().setAttributes({
        url: BASE_URL + '/highlight-news/get-highlight-news',
        application: application,
      });
    });
};
const readHighlight = async (id: string) => {
  return httpClient
    .patch(BASE_URL + `/promotion/highlight-news/update-read/${id}`)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      crashlytics().recordError(err);
      crashlytics().setAttributes({
        url: BASE_URL + `/promotion/highlight-news/update-read/${id}`,
      });
    });
};

export const promotionDatasource = {
  getHighlight,
  readHighlight,
};
