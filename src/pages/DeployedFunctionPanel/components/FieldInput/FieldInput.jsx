import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';
import ResizableTextarea from 'react-textarea-autosize';
import styles from './FieldInput.module.scss';

const InputWithLegend = ({ fieldName, setInputValue, inputValue, fieldType: type, isDropdown=false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };


  const InputComponent = type === 'json' ? 'textarea' : 'input';

  return (
    <div className={styles.container}>
        <fieldset className={classNames(styles.fieldset, {
          [styles.fieldsetFocused]: isFocused,
        })}>
          <legend className={classNames(styles.legend,{
          [styles.legendFocused]: isFocused,
        })}> {fieldName} </legend>
        {
          isDropdown ? (
            <select className={classNames(styles.input ,styles.selectBox)}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
            >
              <option value="0">true</option>
              <option value="1">false</option>
            </select>
          ) :
          <InputComponent
            className={classNames(styles.input, {
              [styles.focused]: isFocused,
            })}
            type={type}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            as={type === 'json' ? ResizableTextarea : undefined}
            ref = {inputRef}
          />
        }
      </fieldset>
    </div>
  );
};

InputWithLegend.propTypes = {
  fieldType: PropTypes.oneOf(['string', 'integer', 'json', 'decimal', 'object']).isRequired,
  isDropdown: PropTypes.bool,
};


export default InputWithLegend;
