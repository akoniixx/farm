import ImageResizer, {
  ResizeFormat,
} from '@bam.tech/react-native-image-resizer';

const ResizeImage = async ({
  uri,
  width = 1000,
  height = 1000,
  format = 'JPEG',
  quality = 90,
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
  options?: any;
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
export { ResizeImage };
