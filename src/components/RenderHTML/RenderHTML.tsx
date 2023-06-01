import React from 'react';
import RHTML, {RenderHTMLProps} from 'react-native-render-html';
import {font} from '../../assets';

interface Props extends RenderHTMLProps {}
export default function RenderHTML(props: Props) {
  return (
    <RHTML
      {...props}
      systemFonts={[font.light, font.semiBold, font.medium, font.bold]}
    />
  );
}
