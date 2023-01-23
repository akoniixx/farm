import { BASE_URL, httpClient } from '../config/develop-config';

export interface PayloadCreateTask {
  farmerId: string;
  farmerPlotId: string;
  farmAreaAmount: string;
  dateAppointment: string;
  targetSpray: string[];
  preparationBy: string;
  purposeSprayId: string;
  taskDronerTemp: {
    dronerId: string;
    status: string;
    dronerDetail: string[];
  }[];
  status: string;
  statusRemark?: string;
  createBy: string;
  cropName: string;
  comment: string;
  couponCode: string;
}

const createTask = async (payload: PayloadCreateTask) => {
  return await httpClient
    .post(BASE_URL + '/tasks/task', payload)
    .then(response => {
      return response.data;
    })
    .catch(error => {
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
      console.log(error);
    });
};

export const TaskDatasource = {
  createTask,
  getTaskByTaskId,
};
