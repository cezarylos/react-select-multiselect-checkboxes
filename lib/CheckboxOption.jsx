import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import CheckboxWithIndeterminate from './CheckboxWithIndeterminate';

function CheckboxOption(props) {
  const {
    children,
    className,
    cx,
    getStyles,
    isDisabled,
    isFocused,
    isSelected,
    innerRef,
    innerProps,
  } = props;
  return (
    <div
      ref={innerRef}
      className={cx(
        css(getStyles('option', props)),
        {
          option: true,
          'option--is-disabled': isDisabled,
          'option--is-focused': isFocused,
          'option--is-selected': isSelected,
        },
        className,
      )}
      {...innerProps}
    >
      <CheckboxWithIndeterminate readOnly type="checkbox" checked={isSelected} />
      {children}
    </div>
  );
}
CheckboxOption.propTypes = {
  children: PropTypes.node,
}

CheckboxOption.defaultProps = {
  children :null,
}

export default CheckboxOption;
