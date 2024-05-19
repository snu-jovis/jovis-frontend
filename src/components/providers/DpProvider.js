import { merge } from "d3";
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

    /* MergeJoin */
    const [innerStartSel, setInnerStartSel] = useState(0);
    const [outerStartSel, setOuterStartSel] = useState(0);
    const [innerEndSel, setInnerEndSel] = useState(0);
    const [outerEndSel, setOuterEndSel] = useState(0);
    const [innerRunCost, setInnerRunCost] = useState(0);
    const [innerPathRows, setInnerPathRows] = useState(0);
    const [outerPathRows, setOuterPathRows] = useState(0);
    const [outerRows, setOuterRows] = useState(0);
    const [innerRows, setInnerRows] = useState(0);
    const [outerSkipRows, setOuterSkipRows] = useState(0);
    const [innerSkipRows, setInnerSkipRows] = useState(0);
    const [bareInnerCost, setBareInnerCost] = useState(0);
    const [matInnerCost, setMatInnerCost] = useState(0);
    const [rescannedTuples, setRescannedtuples] = useState(0);
    const [rescanratio, setRescanratio] = useState(0);

    /* HashJoin */
    const [hashBuildCost, setHashBuildCost] = useState(0);
    const [hashJoinCost, setHashJoinCost] = useState(0);
    const [innerBuildCost, setInnerBuildCost] = useState(0);
    const [outerBuildCost, setOuterBuildCost] = useState(0);
    const [hashCpuCost, setHashCpuCost] = useState(0);
    const [seqPageCost, setSeqPageCost] = useState(0);
    const [numBuckets, setNumBuckets] = useState(0);
    const [numBatches, setNumBatches] = useState(0);
    const [innerPages, setInnerPages] = useState(0);
    const [outerPages, setOuterPages] = useState(0);
    const [initialStartupCost, setInitialStartupCost] = useState(0);
    const [initialRunCost, setInitialRunCost] = useState(0);
    const [numHashClauses, setNumHashClauses] = useState(0);
    const [virtualBuckets, setVirtualBuckets] = useState(0);
    const [innerBucketSize, setInnerBucketSize] = useState(0);
    const [innerMvcfreq, setInnerMvcfreq] = useState(0);

    /* NestLoop */
    const [innerRescanStartCost, setInnerRescanStartCost] = useState(0);
    const [innerRescanTotalCost, setInnerRescanTotalCost] = useState(0);
    const [innerRescanRunCost, setInnerRescanRunCost] = useState(0);
    const [outerMatchedRows, setOuterMatchedRows] = useState(0);
    const [outerUnmatchedRows, setOuterUnmatchedRows] = useState(0);
    const [innerScanFrac, setInnerScanFrac] = useState(0);

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
                targetPerTuple,
                setTargetPerTuple,
                costPerPage,
                setCostPerPage,
                innerPathRows,
                setInnerPathRows,
                outerRows,
                setOuterRows,
                innerRows,
                setInnerRows,
                outerSkipRows,
                setOuterSkipRows,
                innerSkipRows,
                setInnerSkipRows,
                innerRunCost,
                setInnerRunCost,
                bareInnerCost,
                setBareInnerCost,
                matInnerCost,
                setMatInnerCost,
                rescannedTuples,
                setRescannedtuples,
                rescanratio,
                setRescanratio,
                outerPathRows,
                setOuterPathRows,
                outerEndSel,
                setOuterEndSel,
                innerEndSel,
                setInnerEndSel,
                innerStartSel,
                setInnerStartSel,
                outerStartSel,
                setOuterStartSel,
                hashBuildCost,
                setHashBuildCost,
                hashJoinCost,
                setHashJoinCost,
                innerBuildCost,
                setInnerBuildCost,
                outerBuildCost,
                setOuterBuildCost,
                hashCpuCost,
                setHashCpuCost,
                seqPageCost,
                setSeqPageCost,
                numBuckets,
                setNumBuckets,
                numBatches,
                setNumBatches,
                innerPages,
                setInnerPages,
                outerPages,
                setOuterPages,
                initialStartupCost,
                setInitialStartupCost,
                initialRunCost,
                setInitialRunCost,
                numHashClauses,
                setNumHashClauses,
                virtualBuckets,
                setVirtualBuckets,
                innerBucketSize,
                setInnerBucketSize,
                innerMvcfreq,
                setInnerMvcfreq,
                innerRescanStartCost,
                setInnerRescanStartCost,
                innerRescanTotalCost,
                setInnerRescanTotalCost,
                innerRescanRunCost,
                setInnerRescanRunCost,
                outerMatchedRows,
                setOuterMatchedRows,
                outerUnmatchedRows,
                setOuterUnmatchedRows,
                innerScanFrac,
                setInnerScanFrac,
            }}
        >
            {children}
        </DpContext.Provider>
    );
}
