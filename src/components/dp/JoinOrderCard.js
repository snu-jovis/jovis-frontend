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
