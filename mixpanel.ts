import { Mixpanel } from 'mixpanel-react-native';

const trackAutomaticEvents = true;
 export const mixpanel = new Mixpanel("dbdab0029a094a9cd5a329d2fb86f3a9", trackAutomaticEvents);
mixpanel.init();