import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL, httpClient} from '../config/develop-config';

export class Authentication {
    static generateOtp(
        telNumber : String
    ): Promise<any>{
        return axios.post(BASE_URL + "/auth/droner/request-login-otp",{
            telephoneNo : telNumber,
            refCode : telNumber
          }).then(res=>{
            return res.data;
          }).catch(err=>
            console.log(err)
          )
    }
    static login(
        telephoneNo: string,
        otpCode: string,
        token: string,
        refCode: string
    ): Promise<any>{
        return axios.post(BASE_URL + "/auth/droner/verify-otp",{
            telephoneNo: telephoneNo,
            otpCode: otpCode,
            token: token,
            refCode: refCode
          })
          .then(res=>{
            return res.data
          }).catch(err=> console.log(err))
    }
    static async logout(){
        await AsyncStorage.removeItem('token')
        await AsyncStorage.removeItem('droner_id')
    }
}

export class TaskDatasource {
  static getTaskById(
    dronerID: string,
    taskStatus: Array<string>,
    page?: number,
    take?: number,
  ): Promise<any> {
    let taskStatusString = "";
    taskStatus.map((item)=> 
        taskStatusString +=`taskStatus=${item}&`
    )
    return httpClient
      .post(BASE_URL + `/tasks/task/task-droner?dronerId=${dronerID}&${taskStatusString}page=${page}&take=${take}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
}
