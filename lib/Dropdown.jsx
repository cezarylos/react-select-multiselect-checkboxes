import React from 'react';
import PropTypes from 'prop-types';
import Blanket from './Blanket';
import Menu from './Menu';

export default function Dropdown({ children, isOpen, target, onClose, rightAligned }) {
  return (
    <div style={{ position: 'relative' }}>
      {target}
      {isOpen ? <Menu rightAligned={rightAligned}>{children}</Menu> : null}
      {isOpen ? <Blanket onClick={onClose} /> : null}
    </div>
  );
}

Dropdown.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  target: PropTypes.node,
  onClose: PropTypes.func,
  rightAligned: PropTypes.bool,
};
Dropdown.defaultProps = {
  children: null,
  isOpen: false,
  target: null,
  onClose() {},
};
