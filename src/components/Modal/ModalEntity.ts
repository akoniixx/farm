export interface ModalEntity {
  show: boolean;
  onClose?: () => void;
  onMainClick: () => void;
  onBottomClick?: () => void;
}
