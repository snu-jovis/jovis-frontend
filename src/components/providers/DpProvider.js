import { createContext, useState } from "react";

export const DpContext = createContext();

export function DpProvider({ children }) {
    const [showJoinCard, setShowJoinCard] = useState(false);
    const [node, setNode] = useState(null);
    const [joinOrder, setJoinOrder] = useState([]);
    const [startupCost, setStartupCost] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [selectedMetric, setSelectedMetric] = useState("none");

    /* Common */
    const [cpuPerTuple, setCpuPerTuple] = useState(0);
    const [cpuRunCost, setCpuRunCost] = useState(0);
    const [diskRunCost, setDiskRunCost] = useState(0);
    const [pages, setPages] = useState(0);
    const [tuples, setTuples] = useState(0);

    /* IdxScan */
    const [csquared, setCsquared] = useState(0);
    const [maxIOCost, setMaxIOCost] = useState(0);
    const [minIOCost, setMinIOCost] = useState(0);
    const [indexStartupCost, setIndexStartupCost] = useState(0);
    const [indexTotalCost, setIndexTotalCost] = useState(0);
    const [selectivity, setSelectivity] = useState(0);
    const [targetPerTuple, setTargetPerTuple] = useState(0);
    const [costPerPage, setCostPerPage] = useState(0);
    const [qualCost, setQualCost] = useState(0);

    /* MergeJoin */
    const [sortInner, setSortInner] = useState(false);
    const [sortOuter, setSortOuter] = useState(false);
    const [materializeInner, setMaterializeInner] = useState(false);
    const [innerScanCost, setInnerScanCost] = useState(0);
    const [outerScanCost, setOuterScanCost] = useState(0);
    const [mergeJoinTuples, setMergeJoinTuples] = useState(0);
    const [bareInnerCost, setBareInnerCost] = useState(0);
    const [matInnerCost, setMatInnerCost] = useState(0);
    const [mergeEvalCost, setMergeEvalCost] = useState(0);
    const [mergeInitialEvalCost, setMergeInitialEvalCost] = useState(0);

    /* HashJoin */
    const [outerPathStartup, setOuterPathStartup] = useState(0);
    const [outerPathTotal, setOuterPathTotal] = useState(0);
    const [innerPathStartup, setInnerPathStartup] = useState(0);
    const [innerPathTotal, setInnerPathTotal] = useState(0);
    const [numHashClauses, setNumHashClauses] = useState(0);
    const [cpuTupleCost, setCpuTupleCost] = useState(0);
    const [hashCpuCost, setHashCpuCost] = useState(0);
    const [seqPageCost, setSeqPageCost] = useState(0);
    const [innerPages, setInnerPages] = useState(0);
    const [outerPages, setOuterPages] = useState(0);
    const [hashJoinTuples, setHashJoinTuples] = useState(0);
    const [hashQualEvalCost, setHashQualEvalCost] = useState(0);

    /* NestLoop */
    const [outerPathRows, setOuterPathRows] = useState(0);
    const [outerStartupCost, setOuterStartupCost] = useState(0);
    const [outerRunCost, setOuterRunCost] = useState(0);
    const [innerRunCost, setInnerRunCost] = useState(0);
    const [innerStartupCost, setInnerStartupCost] = useState(0);
    const [innerRescanRunCost, setInnerRescanRunCost] = useState(0);
    const [innerRescanStartupCost, setInnerRescanStartupCost] = useState(0);
    const [matchedOuterTupleCost, setMatchedOuterTupleCost] = useState(0);
    const [unmatchedOuterTupleCost, setUnmatchedOuterTupleCost] = useState(0);

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
                qualCost,
                setQualCost,
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
                targetPerTuple,
                setTargetPerTuple,
                costPerPage,
                setCostPerPage,
                sortInner,
                setSortInner,
                sortOuter,
                setSortOuter,
                materializeInner,
                setMaterializeInner,
                innerScanCost,
                setInnerScanCost,
                outerScanCost,
                setOuterScanCost,
                mergeJoinTuples,
                setMergeJoinTuples,
                bareInnerCost,
                setBareInnerCost,
                matInnerCost,
                setMatInnerCost,
                mergeEvalCost,
                setMergeEvalCost,
                mergeInitialEvalCost,
                setMergeInitialEvalCost,
                outerPathStartup,
                setOuterPathStartup,
                outerPathTotal,
                setOuterPathTotal,
                innerPathStartup,
                setInnerPathStartup,
                innerPathTotal,
                setInnerPathTotal,
                numHashClauses,
                setNumHashClauses,
                cpuTupleCost,
                setCpuTupleCost,
                hashCpuCost,
                setHashCpuCost,
                seqPageCost,
                setSeqPageCost,
                innerPages,
                setInnerPages,
                outerPages,
                setOuterPages,
                hashJoinTuples,
                setHashJoinTuples,
                hashQualEvalCost,
                setHashQualEvalCost,
                outerPathRows,
                setOuterPathRows,
                outerStartupCost,
                setOuterStartupCost,
                outerRunCost,
                setOuterRunCost,
                innerRunCost,
                setInnerRunCost,
                innerStartupCost,
                setInnerStartupCost,
                innerRescanRunCost,
                setInnerRescanRunCost,
                innerRescanStartupCost,
                setInnerRescanStartupCost,
                matchedOuterTupleCost,
                setMatchedOuterTupleCost,
                unmatchedOuterTupleCost,
                setUnmatchedOuterTupleCost,
            }}
        >
            {children}
        </DpContext.Provider>
    );
}
