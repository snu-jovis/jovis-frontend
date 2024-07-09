import { createContext, useState } from "react";

export const DpContext = createContext();

export function DpProvider({ children }) {
  const [showJoinCard, setShowJoinCard] = useState(false);
  const [node, setNode] = useState(null);
  const [nodeDetails, setNodeDetails] = useState({});
  const [joinOrder, setJoinOrder] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState("none");

  return (
    <DpContext.Provider
      value={{
        showJoinCard,
        setShowJoinCard,
        node,
        setNode,
        nodeDetails,
        setNodeDetails,
        joinOrder,
        setJoinOrder,
        selectedMetric,
        setSelectedMetric,
      }}
    >
      {children}
    </DpContext.Provider>
  );
}
