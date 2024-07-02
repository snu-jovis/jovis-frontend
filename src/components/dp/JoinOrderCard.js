import React, { useState, useEffect } from "react";
import Latex from "react-latex-next";
import { Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";
import "katex/dist/katex.min.css";
import styles from "./styles";
import { extractNodeType, formatJoinOrder, generateFormulas } from "./utils";
import { HashJoinDetails, MergeJoinDetails, IdxScanDetails, SeqScanDetails } from "./Details";
import { TabPanel } from "./TabPanel";

const JoinOrderCard = ({ showJoinCard, node, joinOrder, totalCost, startupCost, ...props }) => {
    const [nodeType, setNodeType] = useState("");
    const [runCostFormula, setRunCostFormula] = useState("");
    const [startupCostFormula, setStartupCostFormula] = useState("");
    const [runCostValue, setRunCostValue] = useState(0);
    const [startupCostValue, setStartupCostValue] = useState(0);
    const [joinOrderArray, setJoinOrderArray] = useState([]);
    const [selectivity, setSelectivity] = useState(0);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const renderDetails = () => {
        switch (nodeType) {
            case "HashJoin":
                return <HashJoinDetails />;
            case "MergeJoin":
                return <MergeJoinDetails />;
            case "IdxScan":
                return <IdxScanDetails />;
            case "SeqScan":
                return <SeqScanDetails />;
            case "BitmapHeapScan":
                return <SeqScanDetails />;
            default:
                return null;
        }
    };

    useEffect(() => {
        if (showJoinCard && node) {
            const nodeType = extractNodeType(node);
            setNodeType(nodeType);

            const joinOrderText = formatJoinOrder(joinOrder);
            setJoinOrderArray([joinOrderText]);
        }
    }, [showJoinCard, node, joinOrder]);

    useEffect(() => {
        const formulas = generateFormulas(props);
        if (formulas[nodeType]) {
            setRunCostFormula(formulas[nodeType].run);
            setRunCostValue(formulas[nodeType].runValue);
            setStartupCostFormula(formulas[nodeType].startup);
            setStartupCostValue(formulas[nodeType].startupValue);
            setSelectivity(formulas[nodeType].selectivity);
        }
    }, [nodeType, props]);

    return (
        <>
            {showJoinCard && (
                <div>
                    <Tabs value={value} onChange={handleChange} aria-label='cost-formula-card'>
                        <Tab label='Summary' />
                        <Tab label='Cost Calculation' />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        <div className='dp-join-order my-2'>Cost Summary</div>
                        {nodeType === "IdxScan" && (
                            <div className='dp-index-warning'>
                                This index is not selected because its selectivity is 0.
                            </div>
                        )}
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                                            Node Type
                                        </TableCell>
                                        <TableCell style={styles.valueFont}>{nodeType}</TableCell>
                                    </TableRow>
                                    {joinOrder.length > 0 && (
                                        <TableRow>
                                            <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                                                Join Order
                                            </TableCell>
                                            <TableCell>
                                                <span className='join-order-values'>
                                                    {joinOrderArray.map((joinOrder, i) => (
                                                        <Latex key={i} className='latex'>
                                                            {`$${joinOrder}$`}
                                                        </Latex>
                                                    ))}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    <TableRow>
                                        <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                                            Total Cost
                                        </TableCell>
                                        <TableCell style={styles.valueFont}>{totalCost}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                                            Startup Cost
                                        </TableCell>
                                        <TableCell style={styles.valueFont}>{startupCost}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                                            Run Cost
                                        </TableCell>
                                        <TableCell style={styles.valueFont}>
                                            {(totalCost - startupCost).toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <div className='dp-join-order my-2'>Cost Calculation</div>
                        {node.length > 0 && (
                            <>
                                {" "}
                                {nodeType === "IdxScan" && (
                                    <div className='dp-index-warning'>
                                        This index is not selected because its selectivity is 0.
                                    </div>
                                )}
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                                                    Run cost for {nodeType}
                                                </TableCell>
                                                <TableCell style={styles.valueFont}>
                                                    <div style={styles.roundedBox}>{runCostFormula}</div>
                                                    <br />
                                                    <div style={styles.roundedBox}>{runCostValue}</div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                                                    Startup cost for {nodeType}
                                                </TableCell>
                                                <TableCell style={styles.valueFont}>
                                                    <div style={styles.roundedBox}>{startupCostFormula}</div>
                                                    <br />
                                                    {nodeType !== "SeqScan" && (
                                                        <>
                                                            <br />
                                                            <div style={styles.roundedBox}>{startupCostValue}</div>
                                                        </>
                                                    )}{" "}
                                                </TableCell>
                                            </TableRow>
                                            {nodeType === "IdxScan" && (
                                                <>
                                                    <TableRow>
                                                        <TableCell
                                                            style={{ ...styles.tableCell, ...styles.firstColumn }}
                                                        >
                                                            Selectivity
                                                        </TableCell>
                                                        <TableCell style={styles.valueFont}>
                                                            <div style={styles.roundedBox}>{selectivity}</div>
                                                        </TableCell>
                                                    </TableRow>
                                                </>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <br />
                                {(nodeType === "HashJoin" ||
                                    nodeType === "MergeJoin" ||
                                    nodeType === "IdxScan" ||
                                    nodeType === "SeqScan" ||
                                    nodeType === "BitmapHeapScan") && (
                                    <>
                                        <div className='dp-join-order my-2'>Detailed Cost Components</div>
                                        {renderDetails()}
                                    </>
                                )}
                            </>
                        )}
                    </TabPanel>
                </div>
            )}
        </>
    );
};

export default JoinOrderCard;
