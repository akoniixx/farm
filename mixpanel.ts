import {Mixpanel} from 'mixpanel-react-native';
import { MIXPANEL_DEV } from './src/config/develop-config';

const trackAutomaticEvents = true;
export const mixpanel = new Mixpanel(
  MIXPANEL_DEV,
  trackAutomaticEvents,
);
mixpanel.init();
