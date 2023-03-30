import { BASE_URL, httpClient } from '../config/develop-config';

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
    distance:any
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
      throw error;
    });
};

export const TaskDatasource = {
  createTask,
  getTaskByTaskId,
  cancelTask,
  extendFindingDroner,
};
