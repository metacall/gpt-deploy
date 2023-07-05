import React, { useState, useRef } from 'react';
import styles from './SearchBox.module.scss';
const SearchBox = ({ onEnter,onChange,className,placeholder="" }) => {
  const [inputValue, setInputValue] = useState("");
  const ref= useRef(null);
  const handleInputChange = (event) => {
      setInputValue(event.target.value);
      if(onChange)
        onChange(event.target.value)
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if(onEnter){
        onEnter(inputValue);
        setInputValue("");
      }
    }
  };

  return (
    <div className={className + " "+ styles.SearchBox}>
      <input
        type="text"
        value={inputValue}
        placeholder={placeholder}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        ref={ref}
      />
    </div>
  );
};

export default SearchBox;
