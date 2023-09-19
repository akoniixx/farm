import moment from 'moment';

export interface MaintenanceSystem {
  id: string;
  header: string;
  text: string;
  footer: string;
  dateStart: moment.Moment;
  dateEnd: moment.Moment;
  dateNotiStart: string;
  dateNotiEnd: string;
  imagePath: string;
  status: string;
  typeService: string;
  createdAt: string;
  updatedAt: string;
}
export const MaintenanceSystem_INIT: MaintenanceSystem = {
  id: '',
  header: '',
  text: '',
  footer: '',
  dateStart: moment(),
  dateEnd: moment(),
  dateNotiStart: '',
  dateNotiEnd: '',
  imagePath: '',
  status: '',
  typeService: '',
  createdAt: '',
  updatedAt: '',
};
