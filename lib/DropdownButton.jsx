import { colors } from 'react-select/lib/theme';
import { css } from 'emotion';
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node.isRequired,
  onPress: PropTypes.func,
  iconAfter: PropTypes.node,
  style: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

const defaultProps = {
  onPress() {},
  style: {},
  iconAfter: null,
};

export const defaultDropdownButtonStyle = {
  padding: '8px 8px 5px 0px',
  backgroundColor: '#FFF',
  borderRadius: '2px',
  borderWidth: 0,
  boxShadow: '0 1px 1px 1px rgba(0, 0, 0, 0.08)',
  fontStyle: 'normal',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: 1.36,
  alignItems: 'baseline',
  background: '#FFF',
  boxSizing: 'border-box',
  borderColor: colors.neutral20,
  cursor: 'pointer',
  display: 'inline-flex',
  margin: 0,
  maxWidth: '100%',
  outline: 'currentcolor none medium !important',
  textAlign: 'center',
  textDecoration: 'none',
  transition:
    'background 0.1s ease-out 0s, box-shadow 0.15s cubic-bezier(0.47, 0.03, 0.49, 1.38) 0s',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  width: 'auto',
  ':hover': {
    background: 'rgba(9, 30, 66, 0.08) none repeat scroll 0% 0%',
  },
};

const innerSpan = {
  alignSelf: 'center',
  display: 'inline-flex',
  flexWrap: 'nowrap',
  maxWidth: '100%',
};

const iconSpan = {
  alignSelf: 'center',
  display: 'flex',
  flexShrink: 0,
  lineHeight: 0,
  fontSize: 0,
  margin: '0px 4px',
};

const textSpan = {
  alignItems: 'center',
  alignSelf: 'center',
  flex: '1 1 auto',
  margin: '0px 4px',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const defaultStyles = {
  innerSpan,
  iconSpan,
  textSpan,
};

export default function DropdownButton({ onPress, children, iconAfter, style: buttonStyle }) {
  const styles = { ...defaultStyles, button: buttonStyle };
  const childContent =
    typeof children === 'string' ? (
      <span className={css(styles.textSpan)}>{children}</span>
    ) : (
      children
    );
  return (
    <button type="button" className={css(styles.button)} onClick={onPress}>
      <span className={css(styles.innerSpan)}>
        {childContent}
        {!!iconAfter && <span className={css(styles.iconSpan)}>{iconAfter}</span>}
      </span>
    </button>
  );
}
DropdownButton.propTypes = propTypes;
DropdownButton.defaultProps = defaultProps;
