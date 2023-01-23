import { registerSheet } from 'react-native-actions-sheet';
import { CallingModal } from '../Modal/CallingModal';
import SelectInjectionSheet from './SelectInjectionSheet';

registerSheet('sheet-select-injection', SelectInjectionSheet);
registerSheet('CallingSheet', CallingModal);

export {};
