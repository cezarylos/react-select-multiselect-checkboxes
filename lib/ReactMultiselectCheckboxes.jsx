import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Select from 'react-select';
import { colors } from 'react-select/lib/theme';
import CheckboxGroup, { CheckboxGroupHeading } from './CheckboxGroup';
import CheckboxOption from './CheckboxOption';
import ChevronDown from './ChevronDown';
import Dropdown from './Dropdown';
import DropdownButton, { defaultDropdownButtonStyle } from './DropdownButton';
import DropdownIndicator from './DropdownIndicator';

const countOptions = (opts) => {
  if (!opts || !Array.isArray(opts)) return 0;
  return opts.reduce((acc, o) => acc + (o.options ? countOptions(o.options) : 1), 0);
};

const augmentOptionsWithGroupLabel = (opts) => {
  return opts.map(o => {
    if (!o.options) {return o}
  })
}

const defaultStyles = {
  control: (provided) => ({ ...provided, minWidth: 240, margin: 8 }),
  menu: () => ({ boxShadow: 'inset 0 1px 0 rgba(0, 0, 0, 0.1)' }),
  groupHeading: (def, opts) => {
    const provided = {
      ...def,
      marginBottom: 0,
      padding: '8px 12px 4px',
      fontSize: '110%',
      // textTransform: undefined,
      display: 'flex',
      alignItems: 'center',
    };
    if (opts.checked) {
      return { ...provided, backgroundColor: colors.primary50, color: colors.neutral80 };
    }
    if (opts.indeterminate) {
      return { ...provided, backgroundColor: colors.primary25 };
    }
    return {
      ...provided,
      ':hover': {
        backgroundColor: colors.primary25,
      },
    };
  },
  group: (provided) => ({ ...provided, padding: 0 }),
  dropdownButton: (baseProvided, opts) => {
    const provided = { ...baseProvided };
    ['width', 'maxWidth', 'minWidth'].forEach((widthProp) => {
      if (opts[widthProp]) {
        provided[widthProp] = opts[widthProp];
      }
    });
    if (opts.isOpen) {
      return { ...provided, background: colors.neutral3 };
    }
    return provided;
  },
  option: (provided, opts) => {
    if (opts.isSelected) {
      return {
        ...provided,
        color: '#000',
        backgroundColor: colors.primary50,
        fontWeight: 'bold',
        minWidth: 240,
      };
    }
    return {
      ...provided,
      backgroundColor: 'transparent',
      minWidth: 240,
      ':hover': { backgroundColor: colors.primary25 },
    };
  },
};

const defaultComponents = {
  // these three components pertain to react-multiselect-checkboxes
  Dropdown,
  DropdownButton,
  DropdownButtonIcon: ChevronDown,
  // these are react-select components, with sane defaults for react-multiselect-checkboxes
  DropdownIndicator,
  IndicatorSeparator: null,
  Option: CheckboxOption,
  GroupHeading: CheckboxGroupHeading,
  Group: CheckboxGroup,
};

const valueShape = PropTypes.shape({
  value: PropTypes.any,
  label: PropTypes.string,
  options: PropTypes.array,
});
export default class ReactMultiselectCheckboxes extends Component {
  static propTypes = {
    components: PropTypes.shape({
      Dropdown: PropTypes.func,
      DropdownButton: PropTypes.func,
      DropdownButtonIcon: PropTypes.func,
    }),
    options: PropTypes.arrayOf(valueShape).isRequired,
    styles: PropTypes.objectOf(PropTypes.func),
    placeholderButtonLabel: PropTypes.string,
    getDropdownButtonLabel: PropTypes.func,
    onChange: PropTypes.func,
    menuIsOpen: PropTypes.bool,
    rightAligned: PropTypes.bool,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([valueShape, PropTypes.arrayOf(valueShape)]),
    hideSearch: PropTypes.bool,
    minItemsForSearch: PropTypes.number,
    resetInputOnSelect: PropTypes.bool,
    onInputChange: PropTypes.func,
  };

  static defaultProps = {
    menuIsOpen: undefined,
    components: {},
    styles: {},
    placeholderButtonLabel: 'Select...',
    onChange() {},
    getDropdownButtonLabel({ placeholderButtonLabel, value }) {
      if (!value) {
        return placeholderButtonLabel;
      }
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return placeholderButtonLabel;
        }
        if (value.length === 1) {
          return value[0].label;
        }
        return `${value.length} selected`;
      }
      return value.label;
    },
    rightAligned: false,
    width: null,
    minWidth: null,
    maxWidth: null,
    value: null,
    hideSearch: false,
    minItemsForSearch: 0,
    resetInputOnSelect: false,
    onInputChange() {},
  };

  state = { isOpen: false, value: undefined, inputValue: '' };

  onSelectChange = (value, ...rest) => {
    // this.toggleOpen();
    this.setState({ value });
    this.props.onChange(value, ...rest);
  };

  onInputChange = (inputValue, event, ...restArgs) => {
    if (this.props.onInputChange) {
      this.props.onInputChange(inputValue, event, ...restArgs);
    }
    switch (event.action) {
      case 'input-change':
        this.setState({ inputValue });
        break;
      case 'menu-close':
        this.setState({ inputValue: '' });
        break;
      default:
        break;
    }
  };

  toggleOpen = () => {
    this.setState((state) => ({ isOpen: !state.isOpen }));
  };

  calcStyles() {
    // This is messy, but conceptually simple. We're just replacing react-select's defaults
    // with the defaults from defaultStyles for user-provided style functions.
    const propsStyles = { ...this.props.styles };
    Object.entries(defaultStyles).forEach(([k, defaultFunc]) => {
      if (propsStyles[k]) {
        const passedInStyleFunc = propsStyles[k];
        propsStyles[k] = (provided, selectState) =>
          passedInStyleFunc(defaultFunc(provided, selectState), selectState);
      } else {
        propsStyles[k] = defaultFunc;
      }
    });
    return propsStyles;
  }

  render() {
    const {
      getDropdownButtonLabel,
      placeholderButtonLabel,
      components: propsComponents,
      styles: propsStyles,
      menuIsOpen,
      rightAligned,
      onChange, // Don't want to spread this into the select!
      width,
      minWidth,
      maxWidth,
      value: propsValue,
      hideSearch,
      minItemsForSearch,
      options: preTransformOptions,
      resetInputOnSelect,
      onInputChange,
      ...rest
    } = this.props;
    // Values can be duplicated between groups; how to disambiguate? Need to augment grouped options
    // with the group label.
    const components = { ...defaultComponents, ...propsComponents };
    const options = preTransformOptions;
    if (hideSearch || countOptions(options) < minItemsForSearch) {
      components.Control = () => null;
    }
    const styles = this.calcStyles();
    const isOpen = typeof menuIsOpen === 'boolean' ? menuIsOpen : this.state.isOpen;
    const value = propsValue || this.state.value;
    const inputValueIfDefined = resetInputOnSelect ? {} : { inputValue: this.state.inputValue };
    return (
      <components.Dropdown
        isOpen={isOpen}
        rightAligned={rightAligned}
        onClose={this.toggleOpen}
        target={
          <components.DropdownButton
            iconAfter={<components.DropdownButtonIcon />}
            onPress={this.toggleOpen}
            isSelected={isOpen}
            style={styles.dropdownButton(defaultDropdownButtonStyle, {
              value,
              isOpen,
              width,
              minWidth,
              maxWidth,
            })}
          >
            {getDropdownButtonLabel({ placeholderButtonLabel, value })}
          </components.DropdownButton>
        }
      >
        <Select
          autoFocus
          isMulti
          closeMenuOnSelect={false}
          backspaceRemovesValue={false}
          components={components}
          controlShouldRenderValue={false}
          hideSelectedOptions={false}
          isClearable={false}
          menuIsOpen
          onChange={this.onSelectChange}
          placeholder="Search..."
          styles={styles}
          tabSelectsValue={false}
          value={value}
          options={options}
          onInputChange={this.onInputChange}
          inputValue={this.state.inputValue}
          isSearchable
          {...rest}
        />
      </components.Dropdown>
    );
  }
}
