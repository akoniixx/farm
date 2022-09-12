import { CallingModal } from '../components/Modal/CallingModal';
import {registerSheet} from 'react-native-actions-sheet';

/**
 * Registering the sheets here because otherwise sheet closes on
 * hot reload during development.
 */
registerSheet('CallingSheet', CallingModal);
export {};