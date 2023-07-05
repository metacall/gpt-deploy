// import React, { useEffect, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
// import styles from './FieldInput.module.scss';
// import { highlight, languages } from 'prismjs/components/prism-core';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';
// import 'prismjs/themes/prism.css';

// const fieldTypeToStyle = {
//     'bool': styles.boolFieldType,
//     'string': styles.stringFieldType,
//     'number': styles.numberFieldType,
//     }

// const FieldInput = ({ fieldName, setInputValue, inputValue, fieldType }) => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isValid, setIsValid] = useState(true);
//    const isObject = useRef(['object', 'array'].includes(fieldType));
//     const displayBoxRef = useRef(null);
//     const editBoxRef = useRef(null);
  
// const handleOutClick = (e)=>{
//     if (editBoxRef.current && !editBoxRef.current.contains(e.target)){
//         handleInputBlur();
//     }
// }
//   useEffect(()=>{
//     document.addEventListener('click', handleOutClick)
//     return ()=>{
//         document.removeEventListener('click', handleOutClick)
//     }
//   },[])
//   const handleInputChange = (e) => {
//     const newValue = e.target.value;
//     setInputValue(newValue);
//     setIsValid(true);
//   };

//   const handleInputBlur = () => {
//     if (!isValid) {
//       setInputValue('');
//     }
//     setIsEditing(false);
//   };

//   useEffect(()=>{
//     if (isEditing)
//         return ;

//     if (isObject.current) {
//       const highlightedCode = highlight(inputValue, languages.js, 'js');
//       displayBoxRef.current.innerHTML = highlightedCode;
//     } else{
//         displayBoxRef.current.innerHTML = inputValue;
//     }
    
//   },[isEditing, inputValue])

//   const handleInputKeyDown = (e) => {
//     e.stopPropagation();
//     if (e.key === 'Enter' && !isObject.current) {
//       handleInputBlur();
//     }

//     if(e.key === 'Tab' ){
//         e.preventDefault();
//         const start = e.target.selectionStart;
//         const end = e.target.selectionEnd;
//         const value = e.target.value;
//         e.target.value = value.substring(0, start) + "\t" + value.substring(end);
//         e.target.selectionStart = e.target.selectionEnd = start + 1;
//         setInputValue(e.target.value);
//     }
//   };

//   const handleBoxClick = () => {
//       if(!isEditing)
//         setIsEditing(true);
//       else {
//           editBoxRef.current.focus();
//     }
//   };

//   const validateInput = (inputValue) => {
//     if (Array.isArray(inputValue)) {
//       try {
//         JSON.parse(inputValue);
//       } catch (e) {
//         setIsValid(false);
//       }
//     } else if (typeof inputValue === 'boolean') {
//       setIsValid(true);
//     } else if (typeof inputValue === 'object') {
//       try {
//         JSON.parse(inputValue);
//       } catch (e) {
//         setIsValid(false);
//       }
//     } else if (typeof inputValue === 'number') {
//       setIsValid(!isNaN(inputValue));
//     } else if (typeof inputValue === 'string') {
//       setIsValid(true);
//     }
//   };

//   const inputProps = {
//     value: inputValue,
//     onChange: handleInputChange,
//     onBlur: handleInputBlur,
//     onKeyDown: handleInputKeyDown,
//     className: isValid ? styles.inputValid : styles.inputInvalid,
//   };

//   return (
//     <div className={styles.fieldBox} onClick={handleBoxClick} ref = {editBoxRef}>
//       <div className={styles.key}>{fieldName}</div>
//       {isEditing ? (
//         <div className={styles.inputWrapper}>
//           { isObject.current ? (
//             <textarea {...inputProps} />
//           ) : (
//             <input {...inputProps}/>
//           )}
//         </div>
//       ) : (
//         <div className={styles.value} ref={displayBoxRef}>
//             {""}
//         </div>
//       )}
//     </div>
//   );
// };

// FieldInput.propTypes = {
//     fieldName: PropTypes.string.isRequired,
//     setInputValue: PropTypes.func.isRequired,
//     inputValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]).isRequired
// };

// export default FieldInput;

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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

  const handleInputKeyPress = (event) => {
    if (event.key === 'Enter') {
      // Do something on enter key press
    }
  };

  const InputComponent = type === 'json' ? 'textarea' : 'input';
  const inputClassNames = classNames(styles.input, {
    [styles.focused]: isFocused,
  });

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
  type: PropTypes.oneOf(['string', 'integer', 'json', 'decimal']).isRequired,
  isDropdown: PropTypes.bool,
};


export default InputWithLegend;
