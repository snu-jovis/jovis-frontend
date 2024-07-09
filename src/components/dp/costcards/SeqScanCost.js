import { useState, useEffect } from "react";
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { generateFormulas } from "../utils";

const SeqScanCost = ({ nodeDetails }) => {
  const [totalForm, setTotalForm] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [cpuForm, setCpuForm] = useState("");
  const [cpuCost, setCpuCost] = useState("");
  const [diskForm, setDiskForm] = useState("");
  const [diskCost, setDiskCost] = useState("");

  useEffect(() => {
    const formulas = generateFormulas(nodeDetails);

    if (formulas) {
      setTotalForm(formulas.total);
      setTotalCost(formulas.total_cost);

      setCpuForm(formulas.cpu);
      setCpuCost(formulas.cpu_cost);

      setDiskForm(formulas.disk);
      setDiskCost(formulas.disk_cost);
    }
  });

  return (
    <TableContainer>
      <Table className="cost-table">
        <TableBody>
          <TableRow>
            <TableCell>Total Cost</TableCell>
            <TableCell>
              <div dangerouslySetInnerHTML={{ __html: totalForm }} />
              <br />
              <div dangerouslySetInnerHTML={{ __html: totalCost }} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CPU Run Cost</TableCell>
            <TableCell>
              <div dangerouslySetInnerHTML={{ __html: cpuForm }} />
              <br />
              <div dangerouslySetInnerHTML={{ __html: cpuCost }} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Disk Run Cost</TableCell>
            <TableCell>
              <div dangerouslySetInnerHTML={{ __html: diskForm }} />
              <br />
              <div dangerouslySetInnerHTML={{ __html: diskCost }} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SeqScanCost;
