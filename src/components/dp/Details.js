import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper } from "@mui/material";
import styles from "./styles";

export const HashJoinDetails = () => (
    <TableContainer component={Paper}>
        <Table>
            <TableBody>
                <TableRow key='hash-table-build-cpu-cost'>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                        Hash Table Build CPU Cost
                    </TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        (CPU Hash Operator Cost * # of Hash Clauses + CPU Tuple Cost) * Inner Rows
                    </TableCell>
                </TableRow>
                <TableRow key='hash-table-probe-cpu-cost'>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                        Hash Table Probe CPU Cost
                    </TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        (CPU Hash Operator Cost * # of Hash Clauses) * Outer Rows
                    </TableCell>
                </TableRow>
                <TableRow key='disk-page-read-cost'>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>Disk Page Read Cost</TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        Seq Page Cost * Inner Pages
                    </TableCell>
                </TableRow>
                <TableRow key='disk-page-read-write-cost'>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                        Disk Page Read/Write Cost
                    </TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        Seq Page Cost * (Inner Pages + 2 * Outer Pages)
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                        Hash Join Qualification Cost
                    </TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        (Hash Qualification Cost * Hash Join Tuples) * Outer Rows * (Inner Rows * Inner Bucket Size) *
                        0.5
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>Hash Join CPU Cost</TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        CPU Per Tuple * Hash Join Tuples
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
);

export const MergeJoinDetails = () => (
    <TableContainer component={Paper}>
        <Table>
            <TableBody>
                <TableRow key='outer-path-join-cpu-cost'>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                        Outer Path Join CPU Cost
                    </TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        Outer Path Run Cost * (Outer Path End Selectivity - Outer Path Start Selectivity)
                    </TableCell>
                </TableRow>
                <TableRow key='inner-path-join-cpu-cost'>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                        Inner Path Join CPU Cost
                    </TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        Inner Path Run Cost * (Inner Path End Selectivity - Inner Path Start Selectivity)
                    </TableCell>
                </TableRow>
                <TableRow key='outer-path-initial-scan-cost'>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                        Outer Path Initial Scan Cost
                    </TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        Outer Path Run Cost * Outer Path Start Selectivity
                    </TableCell>
                </TableRow>
                <TableRow key='inner-path-initial-scan-cost'>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>
                        Inner Path Initial Scan Cost
                    </TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        Inner Path Run Cost * Inner Path Start Selectivity
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
);

export const IdxScanDetails = () => (
    <TableContainer component={Paper}>
        <Table>
            <TableBody>
                <TableRow key='index-cpu-io-cost'>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>Index CPU & I/O Cost</TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        Index Total Cost - Index Startup Cost
                    </TableCell>
                </TableRow>
                <TableRow key='table-cpu-cost'>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>Table CPU Cost</TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        CPU Tuple Cost * # of Tuples + CPU Target Tuple Cost * # of Target Tuples
                    </TableCell>
                </TableRow>
                <TableRow key='table-io-cost'>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>Table IO Cost</TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        Max IO Cost + C^2 * (Min IO Cost - Max IO cost)
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
);

export const SeqScanDetails = () => (
    <TableContainer component={Paper}>
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>CPU Run Cost</TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        CPU Cost Per Tuple * # of Tuples
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ ...styles.tableCell, ...styles.firstColumn }}>Disk Run Cost</TableCell>
                    <TableCell style={{ ...styles.valueFont, ...styles.roundedBox }}>
                        Seq Page Cost * # of Pages
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </TableContainer>
);
