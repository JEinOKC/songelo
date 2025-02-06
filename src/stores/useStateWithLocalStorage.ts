import { useState } from 'react';

const useStateWithLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState<T>(() => {
    // Get the value from localStorage
    const storedValue = localStorage.getItem(key);
    
    // If there is a stored value, try to parse it to its original type
    if (storedValue !== null) {
      try {
        // Try parsing the JSON to get back the original value
        const parsedValue = JSON.parse(storedValue);
        
        // If the parsed value is the same type as the initial value, return it
        return parsedValue as T;
      } catch (error) {
        // In case parsing fails, fallback to the initial value
        return initialValue;
      }
    }

    // If there is no stored value, return the initial value
    return initialValue;
  });

  const setValueAndStorage = (newValue: T) => {
    setValue(newValue); // Update state
    // Save to localStorage, stringifying the value to store objects or primitives correctly
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setValueAndStorage] as const;
};

export default useStateWithLocalStorage;
