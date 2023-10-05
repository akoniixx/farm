import { BASE_URL, httpClient } from '../config/develop-config';
import crashlytics from '@react-native-firebase/crashlytics';

export interface PayloadCreateTask {
  farmerId: string;
  farmerPlotId: string;
  farmAreaAmount: string;
  dateAppointment: any;
  targetSpray: string[];
  preparationBy: string;
  purposeSprayId: string;
  taskDronerTemp: {
    dronerId: string;
    status: string;
    dronerDetail: string[];
    distance: any;
  }[];
  status: string;
  statusRemark?: string;
  createBy: string;
  cropName: string;
  comment: string;
  couponCode: string;
  usePoint: number;
}

const createTask = async (payload: PayloadCreateTask) => {
  return await httpClient
    .post(BASE_URL + '/tasks/task', payload)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      crashlytics().recordError(error);
      crashlytics().setAttributes({
        url: BASE_URL + '/tasks/task',
        payload: JSON.stringify(payload),
      });
      console.log(error);
    });
};
const getTaskByTaskId = async (taskId: string) => {
  return await httpClient
    .get(BASE_URL + '/tasks/task/' + taskId)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      crashlytics().recordError(error);
      crashlytics().setAttributes({
        url: BASE_URL + '/tasks/task',
        taskId: taskId,
      });
      throw error;
    });
};
const extendFindingDroner = async ({
  farmerId,
  farmerPlotId,
  taskId,
  dateAppointment,
}: {
  farmerId: string;
  farmerPlotId: string;
  taskId: string;
  dateAppointment: string;
}) => {
  const payload = {
    farmerId,
    farmerPlotId,
    taskId,
    dateAppointment,
  };
  return await httpClient
    .post(BASE_URL + '/tasks/task/extend-finding', payload)
    .then(response => {
      return response.data;
    })
    .catch(error => {
      crashlytics().recordError(error);
      crashlytics().setAttributes({
        url: BASE_URL + '/tasks/task/extend-finding',
        payload: JSON.stringify(payload),
      });
      throw error;
    });
};
const cancelTask = async ({
  taskId,
  reason,
}: {
  taskId: string;
  reason: string;
}) => {
  return await httpClient
    .patch(BASE_URL + '/tasks/task/' + taskId, {
      id: taskId,
      status: 'CANCELED',
      statusRemark: reason,
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      crashlytics().recordError(error);
      crashlytics().setAttributes({
        url: BASE_URL + '/tasks/task/' + taskId,
        payload: JSON.stringify({
          id: taskId,
          status: 'CANCELED',
          statusRemark: reason,
        }),
      });
      throw error;
    });
};

export const TaskDatasource = {
  createTask,
  getTaskByTaskId,
  cancelTask,
  extendFindingDroner,
};
