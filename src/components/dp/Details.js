import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export const HashJoinDetails = () => (
  <>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Cost Component</TableCell>
          <TableCell>Formula</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Hash Table Build CPU Cost</TableCell>
          <TableCell>
            (CPU Operator Cost * # of Hash Clauses + CPU Tuple Cost) * Inner
            Rows
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Hash Table Probe CPU Cost</TableCell>
          <TableCell>
            (CPU Operator Cost * # of Hash Clauses + CPU Tuple Cost) * Outer
            Rows
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Disk Page Read Cost</TableCell>
          <TableCell>Seq Page Cost * Inner Pages</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Disk Page Read/Write Cost</TableCell>
          <TableCell>Seq Page Cost * (Inner Pages + 2 * Outer Pages)</TableCell>
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
          <TableCell>Cost Component</TableCell>
          <TableCell>Formula</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Outer Path Join CPU Cost</TableCell>
          <TableCell>
            Outer Path Run Cost * (Outer Path End Selectivity - Outer Path Start
            Selectivity)
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Inner Path Join CPU Cost</TableCell>
          <TableCell>
            Inner Path Run Cost * (Inner Path End Selectivity - Inner Path Start
            Selectivity)
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Outer Path Initial Scan Cost</TableCell>
          <TableCell>
            Outer Path Run Cost * Outer Path Start Selectivity
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Inner Path Initial Scan Cost</TableCell>
          <TableCell>
            Inner Path Run Cost * Inner Path Start Selectivity
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </>
);

export const IdxScanDetails = () => (
  <>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Cost Component</TableCell>
          <TableCell>Formula</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Index CPU & I/O Cost</TableCell>
          <TableCell>Index Total Cost - Index Startup Cost</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Table CPU Cost</TableCell>
          <TableCell>
            CPU Tuple Cost * # of Tuples + CPU Target Tuple Cost * # of Target
            Tuples
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Table IO Cost</TableCell>
          <TableCell>Max IO Cost + C^2 * (Min IO Cost - Max IO cost)</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </>
);
