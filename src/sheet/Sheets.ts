import { CallingModal } from '../components/Modal/CallingModal';
import {registerSheet} from 'react-native-actions-sheet';
import { NewTaskModal } from '../components/Modal/NewTaskModal';

/**
 * Registering the sheets here because otherwise sheet closes on
 * hot reload during development.
 */
registerSheet('CallingSheet', CallingModal);
registerSheet('NewTaskSheet', NewTaskModal)
export {};