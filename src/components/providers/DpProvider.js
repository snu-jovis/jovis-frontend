import { createContext, useState } from "react";

export const DpContext = createContext();

export function DpProvider({ children }) {
    const [showJoinCard, setShowJoinCard] = useState(false);
    const [node, setNode] = useState(null);
    const [joinOrder, setJoinOrder] = useState([]);
    const [startupCost, setStartupCost] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [selectedMetric, setSelectedMetric] = useState("none");
    const [cpuPerTuple, setCpuPerTuple] = useState(0);
    const [cpuRunCost, setCpuRunCost] = useState(0);
    const [diskRunCost, setDiskRunCost] = useState(0);
    const [pages, setPages] = useState(0);
    const [tuples, setTuples] = useState(0);
    const [csquared, setCsquared] = useState(0);
    const [maxIOCost, setMaxIOCost] = useState(0);
    const [minIOCost, setMinIOCost] = useState(0);
    const [indexStartupCost, setIndexStartupCost] = useState(0);
    const [indexTotalCost, setIndexTotalCost] = useState(0);
    const [selectivity, setSelectivity] = useState(0);
    const [T, setT] = useState(0);
    const [targetPerTuple, setTargetPerTuple] = useState(0);
    const [costPerPage, setCostPerPage] = useState(0);

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
                cpuPerTuple,
                setCpuPerTuple,
                cpuRunCost,
                setCpuRunCost,
                diskRunCost,
                setDiskRunCost,
                pages,
                setPages,
                tuples,
                setTuples,
                csquared,
                setCsquared,
                maxIOCost,
                setMaxIOCost,
                minIOCost,
                setMinIOCost,
                indexStartupCost,
                setIndexStartupCost,
                indexTotalCost,
                setIndexTotalCost,
                selectivity,
                setSelectivity,
                T,
                setT,
                targetPerTuple,
                setTargetPerTuple,
                costPerPage,
                setCostPerPage,
            }}
        >
            {children}
        </DpContext.Provider>
    );
}
