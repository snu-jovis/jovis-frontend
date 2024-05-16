import { createContext, useState } from "react";

export const DpContext = createContext();

export function DpProvider({ children }) {
  const [showJoinCard, setShowJoinCard] = useState(false);
  const [node, setNode] = useState(null);
  const [joinOrder, setJoinOrder] = useState([]);
  const [startupCost, setStartupCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState("none");

  return (
    <DpContext.Provider
      value={{
        showJoinCard,
        setShowJoinCard,
        node,
        setNode,
        joinOrder,
        setJoinOrder,
        startupCost,
        setStartupCost,
        totalCost,
        setTotalCost,
        selectedMetric,
        setSelectedMetric,
      }}
    >
      {children}
    </DpContext.Provider>
  );
}
