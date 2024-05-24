import React, { useState, useEffect } from "react";
import Latex from "react-latex-next";
import { Tabs, Tab, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import "katex/dist/katex.min.css";
import styles from "./styles";
import { extractNodeType, formatJoinOrder, generateFormulas } from "./utils";
import { HashJoinDetails, MergeJoinDetails } from "./Details";
import { TabPanel } from "./TabPanel";

const JoinOrderCard = ({ showJoinCard, node, joinOrder, totalCost, startupCost, ...props }) => {
    const [nodeType, setNodeType] = useState("");
    const [runCostFormula, setRunCostFormula] = useState("");
    const [startupCostFormula, setStartupCostFormula] = useState("");
    const [runCostValue, setRunCostValue] = useState(0);
    const [startupCostValue, setStartupCostValue] = useState(0);
    const [joinOrderArray, setJoinOrderArray] = useState([]);
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
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
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead style={styles.tableCell}>
                                    <TableRow>
                                        <TableCell style={styles.firstColumn}>Property</TableCell>
                                        <TableCell>Value</TableCell>
                                    </TableRow>
                                </TableHead>
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
                                {nodeType === "IdxScan" && (
                                    <div className='dp-index-warning'>
                                        This index is not selected because its selectivity is 0.
                                    </div>
                                )}

                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={styles.firstColumn}>Cost Type</TableCell>
                                                <TableCell>Formula</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                                                    Run cost for {nodeType}
                                                </TableCell>
                                                <TableCell style={styles.valueFont}>
                                                    <div style={styles.roundedBox}>{runCostFormula}</div>
                                                    <div style={styles.roundedBox}>{runCostValue}</div>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                                                    Startup cost for {nodeType}
                                                </TableCell>
                                                <TableCell style={styles.valueFont}>
                                                    <div style={styles.roundedBox}>{startupCostFormula}</div>
                                                    <div style={styles.roundedBox}>{startupCostValue}</div>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <br />
                                {(nodeType === "HashJoin" || nodeType === "MergeJoin") && (
                                    <>
                                        <div className='dp-join-order my-2'>Detailed Cost Components</div>
                                        <TableContainer component={Paper}>
                                            {nodeType === "HashJoin" && <HashJoinDetails />}
                                            {nodeType === "MergeJoin" && <MergeJoinDetails />}
                                        </TableContainer>
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
