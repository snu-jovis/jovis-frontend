import katex from "katex";
import "katex/dist/katex.min.css";

// TODO: remove intermediate results

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
        `= ${node.spc_seq_page_cost} \\times ${node.baserel_pages} = ${
          node.spc_seq_page_cost * node.baserel_pages
        } = ${node.disk_run_cost}`
      ),
    };

    if (node.parallel_workers === 0) {
      formulas.cpu = katex.renderToString(
        `\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}} + \\text{Target Cost per Tuple} \\times N_{\\text{rows}}`
      );
      formulas.cpu_cost = katex.renderToString(
        `= ${node.cpu_per_tuple} \\times ${node.baserel_tuples} + ${
          node.pathtarget_cost
        } \\times ${node.rows} = ${
          node.cpu_per_tuple * node.baserel_tuples +
          node.pathtarget_cost * node.rows
        } = ${node.cpu_run_cost}`
      );
    } else {
      formulas.cpu = katex.renderToString(
        `(\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}} + \\text{Target Cost per Tuple} \\times N_{\\text{rows}}) \\div \\text{Parallel Divisor}`
      );
      formulas.cpu_cost = katex.renderToString(
        `= (${node.cpu_per_tuple} \\times ${node.baserel_tuples} + ${
          node.pathtarget_cost
        } \\times ${node.rows}) \\div ${node.parallel_divisor} = ${
          (node.cpu_per_tuple * node.baserel_tuples +
            node.pathtarget_cost * node.rows) /
          node.parallel_divisor
        } = ${node.cpu_run_cost}`
      );
    }

    return formulas;
  }

  if (node.node === "Gather") {
    let formulas = {
      total: katex.renderToString(`\\text{Startup Cost} + \\text{Run Cost}`),
      total_cost: katex.renderToString(
        `= ${node.startup_cost} + ${node.run_cost} = ${
          node.startup_cost + node.run_cost
        } = ${node.total_cost}`
      ),
      run: katex.renderToString(
        `\\text{Subpath Cost} + \\text{Parallel CPU Cost per Tuple} \\times N_{\\text{rows}}`
      ),
      run_cost: katex.renderToString(
        `= ${node.subpath_cost} + ${node.parallel_tuple_cost} \\times ${
          node.rows
        } = ${node.subpath_cost + node.parallel_tuple_cost * node.rows} = ${
          node.run_cost
        }`
      ),
    };

    return formulas;
  }

  if (node.node === "GatherMerge") {
    let formulas = {
      total: katex.renderToString(
        `\\text{Startup Cost} + \\text{Run Cost} + \\text{Input Total Cost}`
      ),
      total_cost: katex.renderToString(
        `= ${node.startup_cost - node.input_startup_cost} + ${
          node.run_cost
        } + ${node.input_total_cost} = ${
          node.startup_cost -
          node.input_startup_cost +
          node.run_cost +
          node.input_total_cost
        } = ${node.total_cost}`
      ),
      run: katex.renderToString(
        `(N_{\\text{rows}} \\times \\text{Comparison Cost} \\times \\log_2 N_{workers}) + (\\text{CPU Cost per Operator} \\times N_{\\text{rows}}) + (\\text{Parallel CPU Cost per Tuple} \\times N_{\\text{rows}} \\times 1.05)`
      ),
      run_cost: katex.renderToString(
        `= (${node.rows} \\times ${node.comparison_cost} \\times ${
          node.logN
        }) + (${node.cpu_operator_cost} \\times ${node.rows}) + (${
          node.parallel_tuple_cost
        } \\times ${node.rows} \\times 1.05) = ${
          node.rows * node.comparison_cost * node.logN +
          node.cpu_operator_cost * node.rows +
          node.parallel_tuple_cost * node.rows * 1.05
        } = ${node.run_cost}`
      ),
    };

    return formulas;
  }

  if (node.node === "IdxScan") {
    let formulas = {
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
      disk: katex.renderToString(
        `\\text{Max IO Cost} +  \\text{Correlation}^2 \\times (\\text{Min IO Cost} - \\text{Max IO Cost})`
      ),
      disk_cost: katex.renderToString(
        `= ${node.max_io_cost} + ${node.index_correlation}^2 \\times (${
          node.min_io_cost
        } - ${node.max_io_cost}) = ${
          node.max_io_cost +
          node.index_correlation ** 2 * (node.min_io_cost - node.max_io_cost)
        } = ${node.disk_run_cost}`
      ),
    };

    if (node.parallel_workers === 0) {
      formulas.cpu = katex.renderToString(
        `\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}} + \\text{Target Cost per Tuple} \\times N_{\\text{rows}}`
      );
      formulas.cpu_cost = katex.renderToString(
        `= ${node.cpu_per_tuple} \\times ${node.baserel_tuples} + ${
          node.pathtarget_cost
        } \\times ${node.rows} = ${
          node.cpu_per_tuple * node.baserel_tuples +
          node.pathtarget_cost * node.rows
        } = ${node.cpu_run_cost}`
      );
    } else {
      formulas.cpu = katex.renderToString(
        `(\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}} + \\text{Target Cost per Tuple} \\times N_{\\text{rows}}) \\div \\text{Parallel Divisor}`
      );
      formulas.cpu_cost = katex.renderToString(
        `= (${node.cpu_per_tuple} \\times ${node.baserel_tuples} + ${
          node.pathtarget_cost
        } \\times ${node.rows}) \\div ${node.parallel_divisor} = ${
          (node.cpu_per_tuple * node.baserel_tuples +
            node.pathtarget_cost * node.rows) /
          node.parallel_divisor
        } = ${node.cpu_run_cost}`
      );
    }

    return formulas;
  }

  if (node.node === "NestLoop") {
    let formulas = {
      total: katex.renderToString(`\\text{Startup Cost} + \\text{Run Cost}`),
      total_cost: katex.renderToString(
        `= ${node.startup_cost} + ${node.run_cost} = ${
          node.startup_cost + node.run_cost
        } = ${node.total_cost}`
      ),
    };

    formulas.run = katex.renderToString(`\\text{Outer Path Run Cost}`);
    formulas.run_cost = katex.renderToString(
      `= ${node.initial_outer_path_run_cost}`
    );

    let intermediate = node.initial_outer_path_run_cost;

    if (node.initial_outer_path_rows > 1) {
      formulas.run += katex.renderToString(
        ` + (N_\\text{outer path rows} - 1) \\times \\text{Inner Rescan Start Cost}`
      );
      formulas.run_cost += katex.renderToString(
        ` + (${node.initial_outer_path_rows} - 1) \\times ${node.initial_inner_rescan_start_cost}`
      );

      intermediate +=
        (node.initial_outer_path_rows - 1) *
        node.initial_inner_rescan_start_cost;
    }

    if (node.is_early_stop === 0) {
      formulas.run += katex.renderToString(` + \\text{Inner Run Cost}`);
      formulas.run_cost += katex.renderToString(
        ` + ${node.initial_inner_run_cost}`
      );

      intermediate += node.initial_inner_run_cost;

      if (node.initial_outer_path_rows > 1) {
        formulas.run += katex.renderToString(
          ` + (N_\\text{outer path rows} - 1) \\times \\text{Inner Rescan Run Cost}`
        );
        formulas.run_cost += katex.renderToString(
          ` + (${node.initial_outer_path_rows} - 1) \\times ${node.initial_inner_rescan_run_cost}`
        );

        intermediate +=
          (node.initial_outer_path_rows - 1) *
          node.initial_inner_rescan_run_cost;
      }
    }

    if (node.is_early_stop === 1) {
      if (node.has_indexed_join_quals === 1) {
        formulas.run += katex.renderToString(
          ` + \\text{Inner Run Cost} \\times \\text{Inner Scan Frac}`
        );
        formulas.run_cost += katex.renderToString(
          ` + ${node.inner_run_cost} \\times ${node.inner_scan_frac}`
        );

        intermediate += node.inner_run_cost * node.inner_scan_frac;

        if (node.outer_matched_rows > 1) {
          formulas.run += katex.renderToString(
            ` + (N_\\text{outer matched rows} - 1) \\times \\text{Inner Rescan Run Cost} \\times \\text{Inner Scan Frac}`
          );
          formulas.run_cost += katex.renderToString(
            `+ (${node.outer_matched_rows} - 1) \\times ${node.inner_rescan_run_cost} \\times ${node.inner_scan_frac}`
          );

          intermediate +=
            (node.outer_matched_rows - 1) *
            node.inner_rescan_run_cost *
            node.inner_scan_frac;
        }

        formulas.run += katex.renderToString(
          ` + (N_\\text{outer unmatched rows} \\times \\text{Inner Rescan Run Cost}) \\div N_\\text{Inner Path Rows}`
        );
        formulas.run_cost += katex.renderToString(
          ` + (${node.outer_unmatched_rows} \\times ${node.inner_rescan_run_cost}) \\div ${node.inner_path_rows}`
        );

        intermediate +=
          (node.outer_unmatched_rows * node.inner_rescan_run_cost) /
          node.inner_path_rows;
      } else {
        formulas.run += katex.renderToString(` + \\text{Inner Run Cost}`);
        formulas.run_cost += katex.renderToString(` + ${node.inner_run_cost}`);

        intermediate += node.inner_run_cost;

        if (node.outer_matched_rows > 0) {
          formulas.run += katex.renderToString(
            ` + N_\\text{outer matched rows} \\times \\text{Inner Rescan Run Cost} \\times \\text{Inner Scan Frac}`
          );
          formulas.run_cost += katex.renderToString(
            ` + ${node.outer_matched_rows} \\times ${node.inner_rescan_run_cost} \\times ${node.inner_scan_frac}`
          );

          intermediate +=
            node.outer_matched_rows *
            node.inner_rescan_run_cost *
            node.inner_scan_frac;
        }

        if (node.outer_unmatched_rows > 0) {
          formulas.run += katex.renderToString(
            ` + N_\\text{outer unmatched rows} \\times \\text{Inner Rescan Run Cost}`
          );
          formulas.run_cost += katex.renderToString(
            ` + ${node.outer_unmatched_rows} \\times ${node.inner_rescan_run_cost}`
          );

          intermediate +=
            node.outer_unmatched_rows * node.inner_rescan_run_cost;
        }
      }
    }

    formulas.run += katex.renderToString(
      ` + \\text{CPU Cost per Tuple} \\times N_\\text{tuples} + \\text{Join Cost per Tuple} \\times N_\\text{join tuples}`
    );
    formulas.run_cost += katex.renderToString(
      ` + ${node.cpu_per_tuple} \\times ${node.ntuples} + ${node.cost_per_tuple} \\times ${node.rows}`
    );

    intermediate +=
      node.cpu_per_tuple * node.ntuples + node.cost_per_tuple * node.rows;

    formulas.run_cost += katex.renderToString(
      `= ${intermediate} = ${node.run_cost}`
    );

    return formulas;
  }

  // if (node.node === "BitmapHeapScan") {
  //   return {
  //     total: katex.renderToString(
  //       `\\text{Startup Cost} + \\text{CPU Run Cost} + \\text{Disk Run Cost}`
  //     ),
  //     total_cost: katex.renderToString(
  //       `= ${node.startup_cost} + ${node.cpu_run_cost} + ${
  //         node.pages_fetched * node.cost_per_page
  //       } = ${
  //         node.startup_cost +
  //         node.cpu_run_cost +
  //         node.pages_fetched * node.cost_per_page
  //       } = ${node.total_cost}`
  //     ),

  //     cpu: katex.renderToString(
  //       `(\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}}) + (\\text{Target Cost per Tuple} \\times N_{\\text{rows}})`
  //     ),
  //     cpu_cost: katex.renderToString(
  //       `= ${node.cpu_per_tuple} \\times ${node.tuples_fetched} + ${node.pathtarget_cost} \\times ${node.rows}`
  //     ),

  //     disk: katex.renderToString(
  //       `N_{\\text{pages\\_fetched}} \\times \\text{Cost per Page}`
  //     ),
  //     disk_cost: katex.renderToString(
  //       `= ${node.pages_fetched} \\times ${node.cost_per_page}`
  //     ),
  //   };
  // }

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
};
