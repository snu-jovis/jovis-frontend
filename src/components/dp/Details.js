import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import styles from "./styles";

export const HashJoinDetails = () => (
    <>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>Cost Component</TableCell>
                    <TableCell>Formula</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                        Hash Table Build CPU Cost
                    </TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        (CPU Operator Cost * # of Hash Clauses + CPU Tuple Cost) * Inner Rows
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                        Hash Table Probe CPU Cost
                    </TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        (CPU Operator Cost * # of Hash Clauses + CPU Tuple Cost) * Outer Rows
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>Disk Page Read Cost</TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        Seq Page Cost * Inner Pages
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                        Disk Page Read/Write Cost
                    </TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        Seq Page Cost * (Inner Pages + 2 * Outer Pages)
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </>
);

export const MergeJoinDetails = () => (
    <>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>Cost Component</TableCell>
                    <TableCell>Formula</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                        Outer Path Join CPU Cost
                    </TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        Outer Path Run Cost * (Outer Path End Selectivity - Outer Path Start Selectivity)
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                        Inner Path Join CPU Cost
                    </TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        Inner Path Run Cost * (Inner Path End Selectivity - Inner Path Start Selectivity)
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                        Outer Path Initial Scan Cost
                    </TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        Outer Path Run Cost * Outer Path Start Selectivity
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                        Inner Path Initial Scan Cost
                    </TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        Inner Path Run Cost * Inner Path Start Selectivity
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </>
);
