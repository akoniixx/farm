import { MaintenanceSystem } from "../../entites/MaintenanceApp";

export interface ModalEntity {
  text?: string;
  show: boolean;
  onClose?: () => void;
  onMainClick: () => void;
  onBottomClick?: () => void;
}
export interface MaintenanceEntity {
  show: boolean;
  onClose?: () => void;
  data: MaintenanceSystem;
}
