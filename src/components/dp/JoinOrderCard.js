import { useState, useEffect } from "react";
import Latex from "react-latex";
import "katex/dist/katex.min.css";

const JoinOrderCard = props => {
    const [node, setNode] = useState("");
    const [runCostFormula, setRunCostFormula] = useState("");
    const [startupCostFormula, setStartupCostFormula] = useState("");
    const [joinOrderArray, setJoinOrderArray] = useState([]);

    useEffect(() => {
        if (props.showJoinCard && props.node) {
            const nodeType = props.node.split(" - ")[1];
            setNode(nodeType);

            const joinOrderParts = props.joinOrder.length > 0 ? props.joinOrder.split(",") : [];
            const joinOrderText = joinOrderParts.reduce((acc, part, i, arr) => {
                const formattedPart = part.trim().replace(/\s+/g, " \\bowtie ");
                return acc + `\\rm{(${formattedPart})}` + (i + 1 < arr.length ? " \\bowtie " : "");
            }, "");
            setJoinOrderArray([joinOrderText]);
        }
    }, [props.showJoinCard, props.node, props.joinOrder]);

    useEffect(() => {
        const formulas = {
            HashJoin: {
                run: "$O(N_{inner} + N_{outer})$",
                startup: "$O(N_{inner} + N_{outer})$",
            },
            MergeJoin: {
                run: "$O(N_{inner} + N_{outer})$",
                startup: "$O(N_{outer}log_{2}(N_{outer}) + N_{inner}log_{2}(N_{inner}))$",
            },
            NestLoop: {
                run: "$O(N_{inner} * N_{outer})$",
                startup: "$0$",
            },
            SeqScan: {
                run: "$CPU\\ Run\\ Cost$ + $Disk\\ Run\\ Cost$",
                startup: "$0$",
            },
            IdxScan: {
                run: "($Index\\ CPU\\ Cost$ + $Table\\ CPU\\ Cost$) + ($Index\\ IO\\ Cost$ + $Table\\ IO\\ Cost$)",
                startup: "$Index\\ Startup\\ Cost$",
            },
            BitmapHeapScan: {
                run: "($CPU\\ cost\\ per\\ tuple$ * $N_{tuples}$) + ($Disk\\ cost\\ per\\ page$ * $N_{pages}$)",
                startup: "$Index\\ Startup\\ Cost$",
            },
        };

        if (formulas[node]) {
            setRunCostFormula(formulas[node].run);
            setStartupCostFormula(formulas[node].startup);
        }
    }, [node]);

    const renderCostDetails = () => {
        const costDetails = {
            SeqScan: (
                <>
                    <Latex>{"$CPU\\ Run\\ Cost$ = $CPU\\ cost\\ per\\ tuple$ * $N_{tuples}$"}</Latex>
                    <br />
                    <Latex>{"$Disk\\ Run\\ Cost$ = $Disk\\ cost\\ per\\ page$ * $N_{pages}$"}</Latex>
                    <br />
                    <br />
                    <Latex>{"$CPU\\ Run\\ Cost$"}</Latex> = {props.cpuRunCost}
                    <br />
                    <Latex>{"$Disk\\ Run\\ Cost$"}</Latex> = {props.diskRunCost}
                    <br />
                    <br />
                    <Latex>{"$CPU\\ cost\\ per\\ tuple$"}</Latex> = {props.cpuPerTuple}
                    <br />
                    <Latex>{"$N_{tuples}$"}</Latex> = {props.tuples}
                    <br />
                    <Latex>{"$Disk\\ cost\\ per\\ page$"}</Latex> = 1.0
                    <br />
                    <Latex>{"$N_{pages}$"}</Latex> = {props.pages}
                </>
            ),
            IdxScan: (
                <>
                    <Latex>{"$CPU\\ cost\\ per\\ tuple$"}</Latex> = {props.cpuPerTuple}
                    <br />
                    <Latex>{"$N_{tuples}$"}</Latex> = {props.tuples}
                    <br />
                    <Latex>{"$Disk\\ cost\\ per\\ page$"}</Latex> = 1.0
                    <br />
                    <Latex>{"$N_{pages}$"}</Latex> = {props.pages}
                    <br />
                    <Latex>{"$Index\\ Startup\\ Cost$"}</Latex> = {props.indexStartupCost}
                    <br />
                    <Latex>{"$Index\\ Total\\ Cost$"}</Latex> = {props.indexTotalCost}
                    <br />
                    <Latex>{"$c^2$"}</Latex> = {props.csquared}
                    <br />
                    <Latex>{"$Max\\ IO\\ Cost$"}</Latex> = {props.maxIOCost}
                    <br />
                    <Latex>{"$Min\\ IO\\ Cost$"}</Latex> = {props.minIOCost}
                    <br />
                    <Latex>{"$Selectivity$"}</Latex> = {props.selectivity}
                </>
            ),
            BitmapHeapScan: (
                <>
                    <Latex>{"$CPU\\ cost\\ per\\ tuple$"}</Latex> = {props.cpuPerTuple}
                    <br />
                    <Latex>{"$N_{tuples}$"}</Latex> = {props.tuples}
                    <br />
                    <Latex>{"$Disk\\ cost\\ per\\ page$"}</Latex> = {props.costPerPage}
                    <br />
                    <Latex>{"$N_{pages}$"}</Latex> = {props.pages}
                    <br />
                    <Latex>{"$Index\\ Total\\ Cost$"}</Latex> = {props.indexTotalCost}
                    <br />
                    <Latex>{"$Sequential\\ Page\\ Cost$"}</Latex> = 1.0
                    <br />
                    <Latex>{"$Sequential\\ Random\\ Cost$"}</Latex> = 4.0
                </>
            ),
            HashJoin: (
                <>
                    <Latex>{"$Hash\\ Build\\ Cost$"}</Latex> = {props.hashBuildCost}
                    <br />
                    <Latex>{"$Hash\\ Join\\ Cost$"}</Latex> = {props.hashJoinCost}
                    <br />
                    <Latex>{"$Inner\\ Build\\ Cost$"}</Latex> = {props.innerBuildCost}
                    <br />
                    <Latex>{"$Outer\\ Build\\ Cost$"}</Latex> = {props.outerBuildCost}
                    <br />
                    <Latex>{"$Hash\\ Cpu\\ Cost$"}</Latex> = {props.hashCpuCost}
                    <br />
                    <Latex>{"$Seq\\ Page\\ Cost$"}</Latex> = {props.seqPageCost}
                    <br />
                    <Latex>{"$N_{buckets}$"}</Latex> = {props.numBuckets}
                    <br />
                    <Latex>{"$N_{batches}$"}</Latex> = {props.numBatches}
                    <br />
                    <Latex>{"$Inner\\ Pages$"}</Latex> = {props.innerPages}
                    <br />
                    <Latex>{"$Outer\\ Pages$"}</Latex> = {props.outerPages}
                    <br />
                    <Latex>{"$Initial\\ Startup\\ Cost$"}</Latex> = {props.initialStartupCost}
                    <br />
                    <Latex>{"$Initial\\ Run\\ Cost$"}</Latex> = {props.initialRunCost}
                    <br />
                    <Latex>{"$Num\\ Hash\\ Clauses$"}</Latex> = {props.numHashClauses}
                    <br />
                    <Latex>{"$Outer\\ Path\\ Rows$"}</Latex> = {props.outerPathRows}
                    <br />
                    <Latex>{"$Inner\\ Path\\ Rows$"}</Latex> = {props.innerPathRows}
                    <br />
                    <Latex>{"$Cpu\\ Per\\ Tuple$"}</Latex> = {props.cpuPerTuple}
                    <br />
                    <Latex>{"$N_{tuples}$"}</Latex> = {props.tuples}
                    <br />
                    <Latex>{"$Virtual\\ Buckets$"}</Latex> = {props.virtualBuckets}
                    <br />
                    <Latex>{"$Inner\\ Bucket\\ Size$"}</Latex> = {props.innerBucketSize}
                    <br />
                    <Latex>{"$Inner\\ Mvc\\ Freq$"}</Latex> = {props.innerMvcfreq}
                    <br />
                </>
            ),
            MergeJoin: (
                <>
                    <Latex>{"$Outer\\ Path\\ Rows$"}</Latex> = {props.outerPathRows}
                    <br />
                    <Latex>{"$Inner\\ Path\\ Rows$"}</Latex> = {props.innerPathRows}
                    <br />
                    <Latex>{"$Outer Rows$"}</Latex> = {props.outerRows}
                    <br />
                    <Latex>{"$Inner\\ Rows$"}</Latex> = {props.innerRows}
                    <br />
                    <Latex>{"$Outer\\ Skip\\ Rows$"}</Latex> = {props.outerSkipRows}
                    <br />
                    <Latex>{"$Inner\\ Skip\\ Rows$"}</Latex> = {props.innerSkipRows}
                    <br />
                    <Latex>{"$Outer\\ End\\ Selectivity$"}</Latex> = {props.outerEndSel}
                    <br />
                    <Latex>{"$Inner\\ Start\\ Selectivity$"}</Latex> = {props.innerStartSel}
                    <br />
                    <Latex>{"$Inner\\ End\\ Selectivity$"}</Latex> = {props.innerEndSel}
                    <br />
                    <Latex>{"$Inner\\ Run\\ Cost$"}</Latex> = {props.innerRunCost}
                    <br />
                    <Latex>{"$Bare\\ Inner\\ Cost$"}</Latex> = {props.bareInnerCost}
                    <br />
                    <Latex>{"$Mat\\ Inner\\ Cost$"}</Latex> = {props.matInnerCost}
                    <br />
                    <Latex>{"$N_{tuples}$"}</Latex> = {props.tuples}
                    <br />
                    <Latex>{"$Rescanned\\ Tuples$"}</Latex> = {props.rescannedTuples}
                    <br />
                    <Latex>{"$Rescan\\ Ratio$"}</Latex> = {props.rescanRatio}
                    <br />
                </>
            ),
            NestLoop: (
                <>
                    <Latex>{"$Inner\\ Rescan\\ Start\\ Cost$"}</Latex> = {props.innerRescanStartCost}
                    <br />
                    <Latex>{"$Inner\\ Rescan\\ Total\\ Cost$"}</Latex> = {props.innerRescanTotalCost}
                    <br />
                    <Latex>{"$Inner\\ Run\\ Cost$"}</Latex> = {props.innerRunCost}
                    <br />
                    <Latex>{"$Inner\\ Rescan\\ Run\\ Cost$"}</Latex> = {props.innerRescanRunCost}
                    <br />
                    <Latex>{"$Outer\\ Path\\ Rows$"}</Latex> = {props.outerPathRows}
                    <br />
                    <Latex>{"$Outer\\ Matched\\ Rows$"}</Latex> = {props.outerMatchedRows}
                    <br />
                    <Latex>{"$Outer\\ Unmatched\\ Rows$"}</Latex> = {props.outerUnmatchedRows}
                    <br />
                    <Latex>{"$Inner\\ Scan Frac$"}</Latex> = {props.innerScanFrac}
                    <br />
                    <Latex>{"$N_{tuples}$"}</Latex> = {props.tuples}
                    <br />
                </>
            ),
        };

        return costDetails[node] || null;
    };

    return (
        <>
            {props.showJoinCard && (
                <div>
                    <div className='dp-join-order my-2'>
                        {props.joinOrder.length > 0 && (
                            <div className='my-4'>
                                Join order:
                                {joinOrderArray.map((joinOrder, i) => (
                                    <Latex key={i} className='latex'>
                                        {`$${joinOrder}$`}
                                    </Latex>
                                ))}
                            </div>
                        )}
                        <div>Total Cost: {props.totalCost}</div>
                        <div>
                            Startup Cost: {props.startupCost} / Run Cost:{" "}
                            {(props.totalCost - props.startupCost).toFixed(2)}
                        </div>
                    </div>

                    <div className='dp-cost-formula'>
                        {props.node.length > 0 && (
                            <>
                                <div>
                                    <br />
                                    Run cost for {node} = <Latex>{runCostFormula}</Latex>
                                </div>
                                <div>
                                    Startup cost for {node} = <Latex>{startupCostFormula}</Latex>
                                </div>
                                <br />
                                {(node === "HashJoin" || node === "MergeJoin" || node === "NestLoop") && (
                                    <>
                                        <Latex>{"$N_{outer}$"}</Latex> = # of tuples in the outer relation
                                        <br />
                                        <Latex>{"$N_{inner}$"}</Latex> = # of tuples in the inner relation
                                        <br />
                                        <br />
                                    </>
                                )}
                                {(node === "SeqScan" || node === "IdxScan" || node === "BitmapHeapScan") && (
                                    <>
                                        <Latex>{"$N_{tuples}$"}</Latex> = # of tuples in the relation
                                        <br />
                                        <Latex>{"$N_{pages}$"}</Latex> = # of pages in the relation
                                        <br />
                                        <br />
                                    </>
                                )}
                                {renderCostDetails()}
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default JoinOrderCard;
