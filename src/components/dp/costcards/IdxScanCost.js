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

  /* TODO */
  const [maxIOForm, setMaxIOForm] = useState("");
  const [maxIOCost, setMaxIOCost] = useState("");
  const [minIOForm, setMinIOForm] = useState("");
  const [minIOCost, setMinIOCost] = useState("");

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
            {/* TODO */}
            {/* <TableRow>
              <TableCell>Max IO Cost</TableCell>
              <TableCell>
                <div dangerouslySetInnerHTML={{ __html: maxIOForm }} />
                <br />
                <div dangerouslySetInnerHTML={{ __html: maxIOCost }} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Min IO Cost</TableCell>
              <TableCell>
                <div dangerouslySetInnerHTML={{ __html: minIOForm }} />
                <br />
                <div dangerouslySetInnerHTML={{ __html: minIOCost }} />
              </TableCell>
            </TableRow> */}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SeqScanCost;
