import { createContext, useState } from "react";

export const GeqoContext = createContext();

export function GeqoProvider({ children }) {
  const [chosen, setChosen] = useState("");
  const [mom, setMom] = useState("");
  const [dad, setDad] = useState("");

  return (
    <GeqoContext.Provider
      value={{
        chosen,
        mom,
        dad,
        setChosen,
        setMom,
        setDad,
      }}
    >
      {children}
    </GeqoContext.Provider>
  );
}
