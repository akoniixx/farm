export enum NotificationType {
  VERIFY = 'VERIFY',
  TASK = 'TASK',
  NEWS = 'NEWS',
  PROMOTIONS = 'PROMOTIONS',
  UNKNOWN = 'UNKNOWN'
}
export interface NotificationCardEntity {
  notificationType: NotificationType;
  title: string;
  subtitle: string;
  dateString: string;
  isRead: boolean;
  expand: boolean;
  onClick: () => void;
}
