import React from 'react';
import { colors } from 'react-select/lib/theme';

export default function Menu(props) {
  const shadow = colors.neutral10a;
  const style = {
    backgroundColor: 'white',
    borderRadius: 4,
    boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
    marginTop: 8,
    position: 'absolute',
    zIndex: 2,
  };
  if (props.rightAligned) {
    style.right = 0;
  }
  return (
    <div
      style={{}}
      {...props}
    />
  );
}
