import { createContext, useState } from "react";

export const GeqoContext = createContext();

export function GeqoProvider({ children }) {
  const [chosen, setChosen] = useState("");

  const [mom, setMom] = useState("");
  const [dad, setDad] = useState("");
  const [child, setChild] = useState("");

  return (
    <GeqoContext.Provider
      value={{
        chosen,
        setChosen,
        mom,
        dad,
        child,
        setMom,
        setDad,
        setChild,
      }}
    >
      {children}
    </GeqoContext.Provider>
  );
}
