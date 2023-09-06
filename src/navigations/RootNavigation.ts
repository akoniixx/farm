import * as React from 'react';

import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef: any = createNavigationContainerRef();

export function navigate(name: any, params: any) {
  if (navigationRef.isReady()) {
    navigationRef.current?.navigate(name, params);
  }
}
