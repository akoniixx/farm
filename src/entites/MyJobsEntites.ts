export interface ReviewDroner {
  taskId: string;
  canReview: 'Yes' | 'No';
  pilotEtiquette: number;
  punctuality: number;
  sprayExpertise: number;
  comment: string;
  updateBy: string;
}
