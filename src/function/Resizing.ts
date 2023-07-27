import ImageResizer, {ResizeFormat} from '@bam.tech/react-native-image-resizer';
import {Options} from '@bam.tech/react-native-image-resizer/lib/typescript/src/types';

const ResizeImage = async ({
  uri,
  width = 1000,
  height = 1000,
  format = 'PNG',
  quality = 95,
  rotation = 0,
  outputPath,
}: {
  uri: any;
  width?: number;
  height?: number;
  format?: ResizeFormat;
  quality?: number;
  rotation?: number;
  outputPath?: string;
  keepMeta?: boolean;
  options?: Options;
}) => {
  return await ImageResizer.createResizedImage(
    uri,
    width,
    height,
    format,
    quality,
    rotation,
    outputPath,
  );
};
export {ResizeImage};
