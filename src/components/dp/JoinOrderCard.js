import { useState, useEffect } from "react";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

const JoinOrderCard = props => {
    const [node, setNode] = useState("");
    const [runCostFormula, setRunCostFormula] = useState("");
    const [startupCostFormula, setStartupCostFormula] = useState("");
    const [joinOrderArray, setJoinOrderArray] = useState([]);

    useEffect(() => {
        if (props.showJoinCard && props.node) {
            const nodeType = extractNodeType(props.node);
            setNode(nodeType);

            const joinOrderText = formatJoinOrder(props.joinOrder);
            setJoinOrderArray([joinOrderText]);
        }
    }, [props.showJoinCard, props.node, props.joinOrder]);

    useEffect(() => {
        const formulas = generateFormulas(props);
        if (formulas[node]) {
            setRunCostFormula(formulas[node].run);
            setStartupCostFormula(formulas[node].startup);
        }
    }, [node]);

    return (
        <>
            {props.showJoinCard && (
                <div>
                    <div className='dp-join-order my-2'>Join Order and Cost Summary</div>
                    <div className='formula-text my-4t'>
                        {props.joinOrder.length > 0 && (
                            <div className='sub-title'>
                                Join order:
                                <div className='center-latex'>
                                    {joinOrderArray.map((joinOrder, i) => (
                                        <Latex key={i} className='latex'>
                                            {`$${joinOrder}$`}
                                        </Latex>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className='sub-title'>Total Cost: </div>
                        {props.totalCost}
                        <div className='sub-title'>Startup Cost: </div> {props.startupCost}
                        <div className='sub-title'>Run Cost: </div>
                        {(props.totalCost - props.startupCost).toFixed(2)}
                    </div>
                    <div className='dp-join-order my-2'>Cost Calculation</div>
                    <div className='dp-cost-formula'>
                        {props.node.length > 0 && (
                            <>
                                {node === "IdxScan" && (
                                    <div className='warning'>
                                        This index is not selected because its selectivity is 0.
                                    </div>
                                )}
                                <div className='formula-text'>
                                    <br />
                                    <div className='sub-title'>Run cost for {node}:</div>
                                    <div className='center-latex'>
                                        <Latex>{runCostFormula}</Latex>
                                    </div>
                                    <br />
                                    <div className='sub-title'>Startup cost for {node}:</div>
                                    <div className='center-latex'>
                                        <Latex>{startupCostFormula}</Latex>
                                    </div>
                                </div>
                                <br />
                                {["SeqScan", "BitmapHeapScan"].includes(node) && <BaseRelationDetails />}
                                {node === "HashJoin" && <HashJoinDetails />}
                                {node === "MergeJoin" && <MergeJoinDetails />}
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

const extractNodeType = node => {
    return node.split(" - ")[1];
};

const formatJoinOrder = joinOrder => {
    if (joinOrder.length === 0) return [];
    const joinOrderParts = joinOrder.split(",");

    if (joinOrderParts.length <= 2) {
        return joinOrderParts.reduce((acc, part, i, arr) => {
            const formattedPart = part.trim().replace(/\s+/g, " \\bowtie ");
            return acc + `${formattedPart}` + (i + 1 < arr.length ? " \\bowtie " : "");
        }, "");
    } else {
        const groupedParts = [];
        for (let i = 0; i < joinOrderParts.length; i += 2) {
            if (i + 1 < joinOrderParts.length) {
                groupedParts.push(
                    `\\rm{(${joinOrderParts[i].replace(/\s+/g, " \\bowtie ")})} \\bowtie ${joinOrderParts[
                        i + 1
                    ].replace(/\s+/g, " \\bowtie ")}`
                );
            } else {
                // If the length is odd, the last element will not have a pair
                groupedParts.push(`\\rm{(${joinOrderParts[i].replace(/\s+/g, " \\bowtie ")})}`);
            }
        }

        return groupedParts;
    }
    return []; // Default case if not 2 or 4 elements
};

const generateFormulas = props => {
    return {
        HashJoin: {
            run: `$Outer\\ Path\\ Run\\ Cost$ + $Hash\\ Table\\ Probe\\ CPU\\ Cost +\\ Disk\\ Page\\ Read/Write\\ Cost \\ (if\\ batching)$  $\\\\ $ = ${
                props.outerPathTotal - props.outerPathStartup
            } + (0.01 * ${props.numHashClauses} * ${props.outerPathRows}) + (1.0 * (${props.innerPages} + 2 * ${
                props.outerPages
            }))`,
            startup: `$(Inner\\ Path\\ Total\\ Cost\\ +\\ Outer\\ Path\\ Startup\\ Cost)\\ +\\ Hash\\ Table\\ Build\\ CPU\\ Cost\\ +\\ Disk\\ Page\\ Read\\ Cost\\ (if\\ batching)$ $\\\\ $ = ${
                props.innerPathTotal + props.outerPathStartup
            } + ${(0.0125 * props.numHashClauses + 1.0) * props.innerPathRows} + (1.0 * ${props.innerPages})`,
        },
        MergeJoin: {
            run: `$Outer\\ Path\\ Join\\ CPU\\ Cost\\ +\\ Inner\\ Path\\ Join\\ CPU\\ Cost$ $\\\\ $ = ${props.initialRunCost} + ${props.innerRunCost}`,
            startup: `$(Outer\\ Path\\ Sort\\ Cost\\ +\\ Inner\\ Path\\ Sort\\ Cost)\\ +\\ (Outer\\ Path\\ Initial\\ Scan\\ Cost\\ +\\ Inner\\ Path\\ Initial\\ Scan\\ Cost)$ $\\\\ $ = (${props.innerStartupCost} + ${props.outerStartupCost}) + (${props.innerScanCost} + ${props.outerScanCost})`,
        },
        NestLoop: {
            run: `$Outer\\ Path\\ Run\\ Cost$ + $Inner\\ Path\\ Run\\ Cost$ + $(N_{outerpathrows} - 1) \\times Inner\\ Rescan\\ Start\\ Cost + (N_{outerpathrows} - 1) \\times Inner\\ Rescan\\ Run\\ Cost$ $\\\\$ = ${props.outerRunCost} + ${props.innerRunCost} + ${props.outerPathRows} * ${props.innerRescanStartupCost} + ${props.outerPathRows} * ${props.innerRescanRunCost}`,
            startup: `$Outer\\ Path\\ Startup\\ Cost$ + $Inner\\ Path\\ Startup\\ Cost$  $\\\\$ = ${props.outerStartupCost} + ${props.innerStartupCost}`,
        },
        SeqScan: {
            run: `($CPU\\ cost\\ per\\ tuple$ * $N_{tuples}$) + ($Disk\\ cost\\ per\\ page$ * $N_{pages}$) $\\\\ $ = (${props.cpuPerTuple} * ${props.tuples}) + (1.0 * ${props.pages})`,
            startup: "$0$",
        },
        IdxScan: {
            run: `($Index\\ CPU\\ Cost$ + $Table\\ CPU\\ Cost$) + ($Index\\ IO\\ Cost$ + $Table\\ IO\\ Cost$) $\\\\ $ = ${(
                props.indexTotalCost - props.indexStartupCost
            ).toFixed(2)} + ${props.cpuRunCost} + (1.0 * ${props.pages})`,
            startup: `$Index\\ Startup\\ Cost$ $\\\\ $ = ${props.indexStartupCost} $\\\\ $ Selectivity = ${props.selectivity}`,
        },
        BitmapHeapScan: {
            run: `($CPU\\ cost\\ per\\ tuple$ * $N_{tuples}$) + ($Disk\\ cost\\ per\\ page$ * $N_{pages}$) $\\\\ $ = (${props.cpuPerTuple} * ${props.tuples}) + (${props.costPerPage} * ${props.pages})`,
            startup: `$Index\\ Total\\ Cost$ $\\\\ $ = ${props.indexTotalCost}`,
        },
    };
};

const BaseRelationDetails = () => (
    <>
        <div className='dp-join-order my-2'>Detailed Cost Components</div>
        <div className='formula-text'>
            <ul>
                <li>
                    <Latex>{"$N_{tuples}$"}</Latex> = # of tuples in the relation
                </li>
                <li>
                    <Latex>{"$N_{pages}$"}</Latex> = # of pages in the relation
                </li>
            </ul>
        </div>
    </>
);

const HashJoinDetails = () => (
    <>
        <div className='dp-join-order my-2'>Detailed Cost Components</div>
        <div className='formula-text'>
            <ul>
                <li>
                    <Latex>{"$Hash\\ Table\\ Build\\ CPU\\ Cost$"}</Latex> = (CPU Operator Cost * # of Hash Clauses +
                    CPU Tuple Cost) * Inner Rows
                </li>
                <li>
                    <Latex>{"$Hash\\ Table\\ Probe\\ CPU\\ Cost$"}</Latex> = (CPU Operator Cost * # of Hash Clauses +
                    CPU Tuple Cost) * Outer Rows
                </li>
                <li>
                    <Latex>{"$Disk\\ Page\\ Read\\ Cost$"}</Latex> = Seq Page Cost * Inner Pages
                </li>
                <li>
                    <Latex>{"$Disk\\ Page\\ Read/Write\\ Cost$"}</Latex> = Seq Page Cost * (Inner Pages + 2 * Outer
                    Pages)
                </li>
            </ul>
        </div>
    </>
);

const MergeJoinDetails = () => (
    <>
        <div className='dp-join-order my-2'>Detailed Cost Components</div>
        <div className='formula-text'>
            <ul>
                <li>
                    <Latex>{"$Outer\\ Path\\ Join\\ CPU\\ Cost$"}</Latex> = Outer Path Run Cost * (Outer Path End
                    Selectivity - Outer Path Start Selectivity)
                </li>
                <li>
                    <Latex>{"$Inner\\ Path\\ Join\\ CPU\\ Cost$"}</Latex> = Inner Path Run Cost * (Inner Path End
                    Selectivity - Inner Path Start Selectivity)
                </li>
                <li>
                    <Latex>{"$Outer\\ Path\\ Initial\\ Scan\\ Cost$"}</Latex> = Outer Path Run Cost * Outer Path Start
                    Selectivity
                </li>
                <li>
                    <Latex>{"$Inner\\ Path\\ Initial\\ Scan\\ Cost$"}</Latex> = Inner Path Run Cost * Inner Path Start
                    Selectivity
                </li>
            </ul>
        </div>
    </>
);

export default JoinOrderCard;
