import {registerSheet} from 'react-native-actions-sheet';
import SheetSelectArea from './SheetSelectArea';
import SheetInfo from './SheetInfo';
import SheetComment from './SheetComment';

registerSheet('selectArea', SheetSelectArea);
registerSheet('nicknameSheet', SheetInfo);
registerSheet('commentSheet', SheetComment);

export {};
