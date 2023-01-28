export interface ModalEntity{
    text? : string,
    show : boolean,
    onClose? : () => void
    onMainClick : () => void
    onBottomClick? : ()=> void
}