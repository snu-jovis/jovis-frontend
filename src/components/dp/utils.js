import katex from "katex";
import "katex/dist/katex.min.css";

export const generateFormulas = (node) => {
  if (node.node === "SeqScan") {
    let formulas = {
      total: katex.renderToString(
        `\\text{Startup Cost} + \\text{CPU Run Cost} + \\text{Disk Run Cost}`
      ),
      total_cost: katex.renderToString(
        `= ${node.startup_cost} + ${node.cpu_run_cost} + ${
          node.disk_run_cost
        } = ${node.startup_cost + node.cpu_run_cost + node.disk_run_cost} = ${
          node.total_cost
        }`
      ),
      disk: katex.renderToString(
        `\\text{Sequential Page Cost} \\times N_{\\text{pages}}`
      ),
      disk_cost: katex.renderToString(
        `= ${node.spc_seq_page_cost} \\times ${node.baserel_pages}`
      ),
    };

    if (node.parallel_divisor > 0) {
      formulas.cpu = katex.renderToString(
        `\\text{CPU Run Cost} \\times N_{\\text{workers}}`
      );
      formulas.cpu_cost = katex.renderToString(
        `= ${node.cpu_run_cost} \\times ${node.parallel_divisor}`
      );
    } else {
      formulas.cpu = katex.renderToString(
        `(\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}}) + (\\text{Target Cost per Tuple} \\times N_{\\text{rows}})`
      );
      formulas.cpu_cost = katex.renderToString(
        `= ${node.cpu_per_tuple} \\times ${node.baserel_tuples} + ${node.pathtarget_cost} \\times ${node.rows}`
      );
    }

    return formulas;
  }

  if (node.node === "IdxScan") {
    let min_io, min_io_cost;

    if (node.pages_fetched > 0) {
    } else {
      min_io = 0;
      min_io_cost = 0;
    }

    return {
      total: katex.renderToString(
        `\\text{Startup Cost} + \\text{Index Scan Cost} + \\text{CPU Run Cost} + \\text{Disk Run Cost}`
      ),
      total_cost: katex.renderToString(
        `= ${node.startup_cost} + ${node.index_scan_cost} + ${
          node.cpu_run_cost
        } + ${node.disk_run_cost} = ${
          node.startup_cost +
          node.index_scan_cost +
          node.cpu_run_cost +
          node.disk_run_cost
        } = ${node.total_cost}`
      ),

      cpu: katex.renderToString(
        `(\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}}) + (\\text{Target Cost per Tuple} \\times N_{\\text{rows}})`
      ),
      cpu_cost: katex.renderToString(
        `= ${node.cpu_per_tuple} \\times ${node.tuples_fetched} + ${node.pathtarget_cost} \\times ${node.rows}`
      ),

      disk: katex.renderToString(
        `\\text{Max IO Cost} +  \\text{Correlation}^2 \\times (\\text{Min IO Cost} - \\text{Max IO Cost})`
      ),
      disk_cost: katex.renderToString(
        `= ${node.max_io_cost} + ${node.index_correlation}^2 \\times (${node.min_io_cost} - ${node.max_io_cost})`
      ),

      // TODO: max_io, max_io_cost, min_io, min_io_cost
    };
  }

  if (node.node === "BitmapHeapScan") {
    return {
      total: katex.renderToString(
        `\\text{Startup Cost} + \\text{CPU Run Cost} + \\text{Disk Run Cost}`
      ),
      total_cost: katex.renderToString(
        `= ${node.startup_cost} + ${node.cpu_run_cost} + ${
          node.pages_fetched * node.cost_per_page
        } = ${
          node.startup_cost +
          node.cpu_run_cost +
          node.pages_fetched * node.cost_per_page
        } = ${node.total_cost}`
      ),

      cpu: katex.renderToString(
        `(\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}}) + (\\text{Target Cost per Tuple} \\times N_{\\text{rows}})`
      ),
      cpu_cost: katex.renderToString(
        `= ${node.cpu_per_tuple} \\times ${node.tuples_fetched} + ${node.pathtarget_cost} \\times ${node.rows}`
      ),

      disk: katex.renderToString(
        `N_{\\text{pages\\_fetched}} \\times \\text{Cost per Page}`
      ),
      disk_cost: katex.renderToString(
        `= ${node.pages_fetched} \\times ${node.cost_per_page}`
      ),
    };
  }

  return {
    total: "N/A",
    total_cost: null,
    cpu: "N/A",
    cpu_cost: null,
    disk: "N/A",
    disk_cost: null,
  };

  // HashJoin: {
  //   run: `Outer Path Run Cost + Hash Table Probe CPU Cost + Disk Page Read/Write Cost (if batching)`,
  //   runValue: `= ${formatNumber(
  //     props.outerPathTotal - props.outerPathStartup
  //   )} + (0.01 * ${formatNumber(props.numHashClauses)} * ${formatNumber(
  //     props.outerPathRows
  //   )}) + (1.0 * (${formatNumber(props.innerPages)} + 2 * ${formatNumber(
  //     props.outerPages
  //   )}))`,
  //   startup: `Inner Path Total Cost + Outer Path Startup Cost + Hash Table Build CPU Cost + Disk Page Read Cost (if batching)`,
  //   startupValue: `= ${formatNumber(
  //     props.innerPathTotal + props.outerPathStartup
  //   )} + ${
  //     (0.0125 * formatNumber(props.numHashClauses) + 1.0) *
  //     formatNumber(props.innerPathRows)
  //   } + (1.0 * ${formatNumber(props.innerPages)})`,
  // },
  // MergeJoin: {
  //   run: `Outer Path Join CPU Cost + Inner Path Join CPU Cost`,
  //   runValue: `= ${formatNumber(props.initialRunCost)} + ${formatNumber(
  //     props.innerRunCost
  //   )}`,
  //   startup: `(Outer Path Sort Cost + Inner Path Sort Cost) + (Outer Path Initial Scan Cost + Inner Path Initial Scan Cost)`,
  //   startupValue: `= (${formatNumber(
  //     props.innerStartupCost
  //   )} + ${formatNumber(props.outerStartupCost)}) + (${formatNumber(
  //     props.innerScanCost
  //   )} + ${formatNumber(props.outerScanCost)})`,
  // },
  // NestLoop: {
  //   run: `Outer Path Run Cost + Inner Path Run Cost + (N_outerpathrows - 1) * Inner Rescan Start Cost + (N_outerpathrows - 1) * Inner Rescan Run Cost`,
  //   runValue: `= ${formatNumber(props.outerRunCost)} + ${formatNumber(
  //     props.innerRunCost
  //   )} + ${formatNumber(props.outerPathRows)} * ${formatNumber(
  //     props.innerRescanStartupCost
  //   )} + ${formatNumber(props.outerPathRows)} * ${formatNumber(
  //     props.innerRescanRunCost
  //   )}`,
  //   startup: `Outer Path Startup Cost + Inner Path Startup Cost`,
  //   startupValue: `= ${formatNumber(props.outerStartupCost)} + ${formatNumber(
  //     props.innerStartupCost
  //   )}`,
  // },
  // IdxScan: {
  //   run: `Index CPU & IO Cost + Table CPU Cost + Table IO Cost`,
  //   runValue: `= ${formatNumber(
  //     props.indexTotalCost - props.indexStartupCost
  //   )} + ${formatNumber(props.cpuRunCost)} + (${props.maxIOCost} + ${
  //     props.csquared
  //   } * (${props.maxIOCost} - ${props.minIOCost}))`,
  //   startup: `Index Startup Cost`,
  //   startupValue: `= ${formatNumber(props.indexStartupCost)}`,
  //   selectivity: `${props.selectivity}`,
  // },
  // BitmapHeapScan: {
  //   run: `(CPU cost per tuple * # of tuples) + (Disk cost per page * # of pages)`,
  //   runValue: `= (${formatNumber(props.cpuPerTuple)} * ${formatNumber(
  //     props.tuples
  //   )}) + (${formatNumber(props.costPerPage)} * ${formatNumber(
  //     props.pages
  //   )})`,
  //   startup: `Index Total Cost`,
  //   startupValue: `= ${formatNumber(props.indexTotalCost)}`,
  // },
  // };
};
