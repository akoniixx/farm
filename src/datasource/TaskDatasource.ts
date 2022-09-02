import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL, httpClient, registerClient} from '../config/develop-config';

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
    static async generateOtpRegister(
      telNumber : String
    ): Promise<any>{
      return axios.post(BASE_URL + "/auth/droner/request-register-otp",{
        telephoneNo : telNumber,
        refCode: telNumber
      }).then(res=>{
        return res.data;
      }).catch(err=> {throw err})
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
          }).catch(err=> {throw err})
    }
    static async logout(){
        await AsyncStorage.removeItem('token')
        await AsyncStorage.removeItem('droner_id')
    }
}

export class Register{
  static getDroneBrand(
    page : number,
    take : number,
  ): Promise<any> {
    return axios.get(BASE_URL + `/drone-brand?isActive=true&page=${page}&take=${take}`).then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
  }
  static getDroneBrandType(
    id : string
  ): Promise<any> {
    return axios.get(BASE_URL + `/drone-brand/${id}`).then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
  }
  static registerStep2(
    firstname : string,
    lastname : string,
    telephoneNo : string,
    id : string,
    address1 : string,
    provinceId : string,
    districtId : string,
    subdistrictId : string,
    postcode : string
  ): Promise<any> {
    return axios.post(BASE_URL + `/auth/droner/register`,{
      firstname : firstname,
      lastname : lastname,
      telephoneNo : telephoneNo,
      status: "OPEN",
      address : {
        address1 : address1,
        address2 : "",
        address3 : "",
        provinceId : provinceId,
        districtId : districtId,
        subdistrictId : subdistrictId,
        postcode : postcode,
      }
    }).then(async(response) => {
      const droner_id = response.data.id;
      console.log(droner_id);
      await AsyncStorage.setItem('droner_id',droner_id)
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
  }

  static async registerStep3(
    telephoneNo : string,
    provinceId : number,
    districtId : number,
    subdistrictId: number,
    locationName : string,
    dronerDrone : any,
    expPlant : string[],
    lat : string,
    long : string,
  ): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id')
    console.log(droner_id);
    return axios.post(BASE_URL + `/auth/droner/register`,{
      id : droner_id,
      status: "PENDING",
      telephoneNo : telephoneNo,
      expPlant : expPlant,
      dronerDrone : dronerDrone,
      dronerArea : {
        lat : lat,
        long : long,
        provinceId : provinceId,
        districtId : districtId,
        subdistrictId: subdistrictId,
        locationName : locationName,
      }
    }).then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
  }

  static async registerStep4(
    telephoneNo : string,
    idNo : string
  ): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id')
    console.log(droner_id);
    return axios.post(BASE_URL + `/auth/droner/register`,{
      id : droner_id,
      status: "ACTIVE",
      telephoneNo : telephoneNo,
      idNo : idNo
    }).then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
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

  static getTaskDetail(
    taskId:string
  ):Promise<any>{
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
    id:string,
    dronerId:string,
    status:string,
    statusRemark?:string,
    updateBy?:string
  ):Promise<any>{
    const data ={
      id:id,
      dronerId:dronerId,
      status:status,
      statusRemark:statusRemark,
      updateBy:updateBy
    }
    return httpClient
    .post(BASE_URL + `/tasks/task/update-task-status`,data)
    .then(response => {
      return response.data;
    })
    .catch(err=> {throw err})
  }
}
