import { faCaretDown, faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

const DropdownMenu = ({ options, selectedOption, setSelectedOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left h-full primary-border">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md shadow-sm px-3 py-0.5 box-border bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className='align-middle flex place-content-center items-center'>{selectedOption ? selectedOption : 'Select an option'}</span>
          <FontAwesomeIcon icon={isOpen?faCaretDown : faCaretLeft} className='ml-3 text-lg align-middle flex place-content-center items-center'/>
        </button>
      </div>
      {isOpen && (
        <div className="primary-border origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {options.map((option, index) => (
              <button
                key={option}
                onClick={() => handleOptionClick(option)}
                className={`block w-full  px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                role="menuitem"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
