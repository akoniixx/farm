import { BASE_URL, httpClient } from '../config/develop-config';

interface IGetShopList {
  take?: number;
  page?: number;
}
const getShopList = ({ take = 999, page = 1 }: IGetShopList) => {
  return httpClient
    .get(
      `${BASE_URL}/shop/find-all-shop?isActive=true&take=${take}&page=${page}`,
    )
    .then(res => res.data)
    .catch(err => err);
};

export const shopDatasource = {
  getShopList,
};
