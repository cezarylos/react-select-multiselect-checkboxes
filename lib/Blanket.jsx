import React from 'react';
import { colors } from 'react-select/lib/theme';

export default function Blanket(props) {
  return <div
    style={{
      bottom: 0,
      left: 0,
      top: 0,
      right: 0,
      position: 'fixed',
      zIndex: 1,
    }}
    {...props}
  />
}
