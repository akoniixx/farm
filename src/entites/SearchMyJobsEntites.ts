export interface SearchMyJobsEntites{
    farmerId: string|null,
    stepTab: string,
    sortField: string,
    sortDirection?: string,
    filterStatus:string
}
export interface DelayTask {
    date_delay?: any;
    delay_reject_remark?: any;
    delay_remark?: any;
    is_delay: boolean;
}

export interface Droner {
    count_rating?: any;
    droner_id?: any;
    firstname?: any;
    image_profile?: any;
    lastname?: any;
    rating_avg?: any;
    telephone_no?: any;
}

export interface RootObject {
    comment: string;
    date_appointment: Date;
    date_to_orderby: Date;
    delay_task: DelayTask;
    droner: Droner;
    landmark: string;
    lat: string;
    location_name: string;
    long: string;
    plant_name: string;
    plot_id: string;
    plot_name: string;
    preparation_by: string;
    rai_amount: string;
    status: string;
    status_delay?: any;
    target_spray: string[];
    task_id: string;
    task_late_status: boolean;
    task_no: string;
    total_price: string;
    unit_price: string;
    updated_at: Date;
}