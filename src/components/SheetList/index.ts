import { registerSheet } from 'react-native-actions-sheet';
import SelectCallingSheet from './SelectCallingSheet';
import SelectInjectionSheet from './SelectInjectionSheet';

registerSheet('sheet-select-injection', SelectInjectionSheet);
registerSheet('sheet-select-calling', SelectCallingSheet);
export {};
