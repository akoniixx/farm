import { registerSheet } from 'react-native-actions-sheet';
import { CallingModal } from '../Modal/CallingModal';
import SelectInjectionSheet from './SelectInjectionSheet';
import InfoSheet from './InfoSheet';
import SelectTargetSpray from './SelectTargetSpray';
import SelectAddressSheet from './SelectAddressSheet';
import SelectReceiverSheet from './SelectReceiverSheet';

registerSheet('sheet-select-injection', SelectInjectionSheet);
registerSheet('CallingSheet', CallingModal);
registerSheet('placePlot', InfoSheet);
registerSheet('positionPlot', InfoSheet);
registerSheet('targetSpray', InfoSheet);
registerSheet('injectTime', InfoSheet);
registerSheet('selectTargetSpray', SelectTargetSpray);
registerSheet('selectAddress', SelectAddressSheet);
registerSheet('selectReceiver', SelectReceiverSheet);

export {};
