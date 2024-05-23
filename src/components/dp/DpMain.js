import React, { useEffect, useState, useRef, useContext } from "react";
import { DpContext } from "../providers/DpProvider";
import { Card } from "@material-tailwind/react";
import QueryPlanTree from "../geqo/QueryPlanTree";
import GraphView from "./GraphView";
import JoinOrderCard from "./JoinOrderCard";
import DescriptionCard from "./DescriptionCard";

import "../../assets/stylesheets/Dp.css";

const DpMain = ({ data, plan }) => {
    const {
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
        initialRunCost,
        setInitialRunCost,
        numHashClauses,
        setNumHashClauses,
        hashCpuCost,
        setHashCpuCost,
        seqPageCost,
        setSeqPageCost,
        outerPathStartup,
        setOuterPathStartup,
        outerPathTotal,
        setOuterPathTotal,
        innerPathStartup,
        setInnerPathStartup,
        innerPathTotal,
        setInnerPathTotal,
        innerPages,
        setInnerPages,
        outerPages,
        setOuterPages,
        cpuTupleCost,
        setCpuTupleCost,
        innerRescanRunCost,
        setInnerRescanRunCost,
        innerRescanStartupCost,
        setInnerRescanStartupCost,
        outerStartupCost,
        setOuterStartupCost,
        outerRunCost,
        setOuterRunCost,
        innerStartupCost,
        setInnerStartupCost,
    } = useContext(DpContext);

    const viewRef = useRef(null);
    const [viewSize, setViewSize] = useState([0, 0]);

    useEffect(() => {
        setShowJoinCard(false);
        setNode(null);
        setJoinOrder([]);
        setStartupCost(0);
        setTotalCost(0);
        setSelectedMetric("Default");

        /* Common */
        setCpuPerTuple(0);
        setCpuRunCost(0);
        setDiskRunCost(0);
        setPages(0);
        setTuples(0);

        /* IdxScan */
        setCsquared(0);
        setMaxIOCost(0);
        setMinIOCost(0);
        setIndexStartupCost(0);
        setIndexTotalCost(0);
        setSelectivity(0);
        setTargetPerTuple(0);
        setCostPerPage(0);

        /* MergeJoin */
        setInnerPathRows(0);
        setOuterRows(0);
        setInnerRows(0);
        setOuterSkipRows(0);
        setInnerSkipRows(0);
        setInnerRunCost(0);
        setOuterPathRows(0);
        setOuterEndSel(0);
        setInnerEndSel(0);
        setInnerStartSel(0);
        setOuterStartSel(0);
        setInnerScanCost(0);
        setOuterScanCost(0);
        setSortInner(false);
        setSortOuter(false);
        setMaterializeInner(false);
        setInitialRunCost(0);

        /* HashJoin */
        setOuterPathStartup(0);
        setOuterPathTotal(0);
        setInnerPathStartup(0);
        setInnerPathTotal(0);
        setNumHashClauses(0);
        setCpuTupleCost(0);
        setHashCpuCost(0);
        setSeqPageCost(0);
        setInnerPages(0);
        setOuterPages(0);

        /* NestLoop */
        setInnerRescanRunCost(0);
        setOuterRunCost(0);
        setOuterStartupCost(0);
        setInnerStartupCost(0);
        setInnerRescanStartupCost(0);

        const updateSize = () => {
            if (viewRef.current) setViewSize([viewRef.current.offsetWidth, viewRef.current.offsetHeight]);
        };

        // initial size
        updateSize();

        // update sizes on resize
        window.addEventListener("resize", updateSize);

        // cleanup
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <div ref={viewRef} className='w-full flex flex-wrap'>
            <div className='w-3/4'>
                <GraphView
                    width={viewSize[0] ? (3 * viewSize[0]) / 4 : 500}
                    height={viewSize[1] ? viewSize[1] : 500}
                    base={data.base}
                    dp={data.dp}
                    cost={plan["Total Cost"]}
                />
            </div>
            <div className='w-1/4 flex flex-col'>
                <Card className='h-1/3 mb-4'>
                    <QueryPlanTree
                        width={viewSize[0] ? viewSize[0] / 4 : 500}
                        height={viewSize[1] ? viewSize[1] / 3 - 16 : 500}
                        plan={plan}
                    />
                </Card>
                <Card className='h-1/2 mb-4'>
                    <div className='flex justify-between px-4 pt-2'>
                        <p className='vis-title pt-2'>Description</p>
                    </div>
                    <DescriptionCard showJoinCard={showJoinCard} node={node} />
                </Card>
            </div>
            <Card className='w-3/4 h-full'>
                <div className='flex justify-between px-4 pt-2'>
                    <p className='vis-title pt-2'>Cost Formula</p>
                </div>
                <JoinOrderCard
                    showJoinCard={showJoinCard}
                    node={node}
                    joinOrder={joinOrder}
                    startupCost={startupCost}
                    totalCost={totalCost}
                    cpuPerTuple={cpuPerTuple}
                    cpuRunCost={cpuRunCost}
                    diskRunCost={diskRunCost}
                    pages={pages}
                    tuples={tuples}
                    csquared={csquared}
                    maxIOCost={maxIOCost}
                    minIOCost={minIOCost}
                    indexStartupCost={indexStartupCost}
                    indexTotalCost={indexTotalCost}
                    selectivity={selectivity}
                    targetPerTuple={targetPerTuple}
                    costPerPage={costPerPage}
                    innerPathRows={innerPathRows}
                    outerRows={outerRows}
                    innerRows={innerRows}
                    outerSkipRows={outerSkipRows}
                    innerSkipRows={innerSkipRows}
                    innerRunCost={innerRunCost}
                    sortInner={sortInner}
                    sortOuter={sortOuter}
                    materializeInner={materializeInner}
                    innerScanCost={innerScanCost}
                    outerScanCost={outerScanCost}
                    outerPathRows={outerPathRows}
                    outerEndSel={outerEndSel}
                    innerEndSel={innerEndSel}
                    innerStartSel={innerStartSel}
                    outerStartSel={outerStartSel}
                    initialRunCost={initialRunCost}
                    outerPathStartup={outerPathStartup}
                    outerPathTotal={outerPathTotal}
                    innerPathStartup={innerPathStartup}
                    innerPathTotal={innerPathTotal}
                    numHashClauses={numHashClauses}
                    hashCpuCost={hashCpuCost}
                    seqPageCost={seqPageCost}
                    cpuTupleCost={cpuTupleCost}
                    innerPages={innerPages}
                    outerPages={outerPages}
                    innerRescanRunCost={innerRescanRunCost}
                    innerRescanStartupCost={innerRescanStartupCost}
                    outerRunCost={outerRunCost}
                    outerStartupCost={outerStartupCost}
                    innerStartupCost={innerStartupCost}
                />
            </Card>
        </div>
    );
};

export default DpMain;
