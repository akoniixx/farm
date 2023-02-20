export const callcenterNumber = '022339000';

export const callCenterDash = () => {
    return callcenterNumber.slice(0, 2) + '-' + callcenterNumber.slice(2);
}
