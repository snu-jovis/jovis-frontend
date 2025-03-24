import { createContext, useState } from "react";

export const SqlToEditorContext = createContext({
  call: () => {},
  setCallback: () => {},
});

export function SqlToEditorProvider({ children }) {
  const [func, setFunc] = useState(null);

  const callHandler = (type, value) => {
    if (!func) return null;
    return func(type, value);
  };

  const setCallbackHandler = (callback) => {
    setFunc(() => callback);
  };

  return (
    <SqlToEditorContext.Provider
      value={{
        call: callHandler,
        setCallback: setCallbackHandler,
      }}
    >
      {children}
    </SqlToEditorContext.Provider>
  );
}
