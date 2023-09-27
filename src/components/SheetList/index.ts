import { registerSheet } from 'react-native-actions-sheet';
import { CallingModal } from '../Modal/CallingModal';
import SelectInjectionSheet from './SelectInjectionSheet';
import InfoSheet from './InfoSheet';

registerSheet('sheet-select-injection', SelectInjectionSheet);
registerSheet('CallingSheet', CallingModal);
registerSheet('placePlot', InfoSheet);
registerSheet('positionPlot', InfoSheet);

export {};
