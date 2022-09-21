import {
  BASE_URL,
  httpClient,
  registerClient,
  taskFormDataClient,
  uploadFileClient,
} from '../config/develop-config';

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
        console.log(error);
      });
  }

  static getTaskDetail(taskId: string): Promise<any> {
    return httpClient
      .get(BASE_URL + `/tasks/task/${taskId}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static updateTaskStatus(
    id: string,
    dronerId: string,
    status: string,
    statusRemark?: string,
    updateBy?: string,
  ): Promise<any> {
    const data = {
      id: id,
      dronerId: dronerId,
      status: status,
      statusRemark: statusRemark,
      updateBy: updateBy,
    };
    return httpClient
      .post(BASE_URL + `/tasks/task/update-task-status`, data)
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
      .post(BASE_URL + `/tasks/task/receive-task`, data)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err;
      });
  }

  static async finishTask(file: any,taskId:string,reviewFarmerScore:number,reviewFarmerComment:string,): Promise<any> {
    const data = new FormData();
    data.append('taskId', taskId);
    data.append('reviewFarmerScore', reviewFarmerScore);
    data.append('reviewFarmerComment', reviewFarmerComment);
    data.append('file', {
      uri: file.assets[0].uri,
      name: file.assets[0].fileName,
      type: file.assets[0].type,
    });
    return taskFormDataClient
      .post(BASE_URL + `/tasks/task/finish-task`, data)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        throw err;
      });
  }
}
