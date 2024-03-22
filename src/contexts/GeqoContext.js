import { createContext, useState } from "react";

export const GeqoContext = createContext();
const GeqoContextProvider = (props) => {
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
      {props.children}
    </GeqoContext.Provider>
  );
};

export default GeqoContextProvider;
