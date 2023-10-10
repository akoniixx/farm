import {registerSheet} from 'react-native-actions-sheet';
import SheetSelectArea from './SheetSelectArea';
import SheetInfo from './SheetInfo';

registerSheet('selectArea', SheetSelectArea);
registerSheet('nicknameSheet', SheetInfo);

export {};
