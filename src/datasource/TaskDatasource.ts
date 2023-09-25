import {
  BASE_URL,
  httpClient,
  registerClient,
  taskFormDataClient,
  uploadFileClient,
} from '../config/develop-config';

interface PayloadTask {
  taskId: string;
  reviewFarmerScore: number;
  reviewFarmerComment: string;
  updateBy: string;
  file: any;
  fileDrug: any;
}
export class TaskDatasource {
  static getTaskById(
    dronerID: string,
    taskStatus: Array<string>,
    page?: number,
    take?: number,
  ): Promise<any> {
    let taskStatusString = '';
    taskStatus.map(item => (taskStatusString += `taskStatus=${item}&`));
    return httpClient
      .post(
        BASE_URL +
          `/tasks/task/task-droner?dronerId=${dronerID}&${taskStatusString}page=${page}&take=${take}`,
      )
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  }

  static getTaskDetail(taskId: string, dronerId: string): Promise<any> {
    return httpClient
      .post(
        BASE_URL +
          `/tasks/task/task-droner-detail?taskId=${taskId}&dronerId=${dronerId}`,
      )
      .then(response => {
        return response.data;
      })
      .catch(error => {
        throw error;
      });
  }

  static updateTaskStatus(
    id: string,
    dronerId: string,
    status: string,
    updateBy: string,
    statusRemark?: string,
  ): Promise<any> {
    const data = {
      id: id,
      dronerId: dronerId,
      status: status,
      statusRemark: statusRemark,
      updateBy: updateBy,
    };
    return httpClient
      .post(BASE_URL + '/tasks/task/update-task-status', data)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err;
      });
  }

  static receiveTask(
    taskId: string,
    dronerId: string,
    receive: boolean,
  ): Promise<any> {
    const data = {
      taskId,
      dronerId,
      receive,
    };

    return httpClient
      .post(BASE_URL + '/tasks/task/receive-task', data)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err;
      });
  }

  static async finishTask(payload: PayloadTask) {
    const data = new FormData();

    data.append('taskId', payload.taskId);
    data.append('reviewFarmerScore', payload.reviewFarmerScore);
    data.append('reviewFarmerComment', payload.reviewFarmerComment);
    data.append('file', {
      uri: payload.file.assets[0].uri,
      name: payload.file.assets[0].fileName,
      type: payload.file.assets[0].type,
    });
    data.append('fileDrug', {
      uri: payload.fileDrug.assets[0].uri,
      name: payload.fileDrug.assets[0].fileName,
      type: payload.fileDrug.assets[0].type,
    });
    data.append('updateBy', payload.updateBy);
    return taskFormDataClient
      .post(BASE_URL + '/tasks/task/finish-task', data)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        console.log('catch', err.response.data);
        throw err;
      });
  }

  static async onExtendTaskRequest({
    statusDelay = 'WAIT_APPROVE',
    ...payload
  }: {
    taskId: string;
    dateDelay: string;
    statusDelay?: string;
    delayRemark: string;
  }): Promise<any> {
    return httpClient
      .post(BASE_URL + '/tasks/task/request-extend', {
        statusDelay,
        ...payload,
      })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static openReceiveTask(id: string, isOpen: boolean): Promise<any> {
    const data = {id, isOpen};

    return httpClient
      .post(BASE_URL + '/droner/open-receive-task', data)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err;
      });
  }
}
