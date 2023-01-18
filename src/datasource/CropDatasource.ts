import { BASE_URL, httpClient } from "../config/develop-config";


export class CropDatasource {
  static getPurposeByCroupName(name: string): Promise<any> {
    return httpClient
      .get(BASE_URL + "/tasks/crop/crop-name?name=" + name)
      .then((response) => {
        return response.data[0];
      })
      .catch((err) => {
        console.log(err, "err getCropByName");
      });
  }
}
