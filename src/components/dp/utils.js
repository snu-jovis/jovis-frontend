import katex from "katex";
import "katex/dist/katex.min.css";

export const generateFormulas = (node) => {
  if (node.node === "SeqScan") {
    let formulas = {
      total: katex.renderToString(
        `\\text{Startup Cost} + \\text{CPU Run Cost} + \\text{Disk Run Cost}`
      ),
      total_cost: katex.renderToString(
        `= ${node.startup_cost} + ${node.cpu_run_cost} + ${node.disk_run_cost} = ${node.total_cost}`
      ),
      disk: katex.renderToString(
        `\\text{Sequential Page Cost} \\times N_{\\text{pages}}`
      ),
      disk_cost: katex.renderToString(
        `= ${node.spc_seq_page_cost} \\times ${node.baserel_pages} = ${node.disk_run_cost}`
      ),
    };

    if (node.parallel_workers === 0) {
      formulas.cpu = katex.renderToString(
        `\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}} + \\text{Target Cost per Tuple} \\times N_{\\text{rows}}`
      );
      formulas.cpu_cost = katex.renderToString(
        `= ${node.cpu_per_tuple} \\times ${node.baserel_tuples} + ${node.pathtarget_cost} \\times ${node.rows} = ${node.cpu_run_cost}`
      );
    } else {
      formulas.cpu = katex.renderToString(
        `(\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}} + \\text{Target Cost per Tuple} \\times N_{\\text{rows}}) \\div \\text{Parallel Divisor}`
      );
      formulas.cpu_cost = katex.renderToString(
        `= (${node.cpu_per_tuple} \\times ${node.baserel_tuples} + ${node.pathtarget_cost} \\times ${node.rows}) \\div ${node.parallel_divisor} = ${node.cpu_run_cost}`
      );
    }

    return formulas;
  }

  if (node.node === "Gather") {
    let formulas = {
      total: katex.renderToString(`\\text{Startup Cost} + \\text{Run Cost}`),
      total_cost: katex.renderToString(
        `= ${node.startup_cost} + ${node.run_cost} = ${node.total_cost}`
      ),
      run: katex.renderToString(
        `\\text{Subpath Cost} + \\text{Parallel CPU Cost per Tuple} \\times N_{\\text{rows}}`
      ),
      run_cost: katex.renderToString(
        `= ${node.subpath_cost} + ${node.parallel_tuple_cost} \\times ${node.rows} = ${node.run_cost}`
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
        } + ${node.input_total_cost} = ${node.total_cost}`
      ),
      run: katex.renderToString(
        `(N_{\\text{rows}} \\times \\text{Comparison Cost} \\times \\log_2 N_{workers}) + (\\text{CPU Cost per Operator} \\times N_{\\text{rows}}) + (\\text{Parallel CPU Cost per Tuple} \\times N_{\\text{rows}} \\times 1.05)`
      ),
      run_cost: katex.renderToString(
        `= (${node.rows} \\times ${node.comparison_cost} \\times ${node.logN}) + (${node.cpu_operator_cost} \\times ${node.rows}) + (${node.parallel_tuple_cost} \\times ${node.rows} \\times 1.05) = ${node.run_cost}`
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
        `= ${node.startup_cost} + ${node.index_scan_cost} + ${node.cpu_run_cost} + ${node.disk_run_cost} = ${node.total_cost}`
      ),
      disk: katex.renderToString(
        `\\text{Max IO Cost} +  \\text{Correlation}^2 \\times (\\text{Min IO Cost} - \\text{Max IO Cost})`
      ),
      disk_cost: katex.renderToString(
        `= ${node.max_io_cost} + ${node.index_correlation}^2 \\times (${node.min_io_cost} - ${node.max_io_cost}) = ${node.disk_run_cost}`
      ),
    };

    if (node.parallel_workers === 0) {
      formulas.cpu = katex.renderToString(
        `\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}} + \\text{Target Cost per Tuple} \\times N_{\\text{rows}}`
      );
      formulas.cpu_cost = katex.renderToString(
        `= ${node.cpu_per_tuple} \\times ${node.baserel_tuples} + ${node.pathtarget_cost} \\times ${node.rows} = ${node.cpu_run_cost}`
      );
    } else {
      formulas.cpu = katex.renderToString(
        `(\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}} + \\text{Target Cost per Tuple} \\times N_{\\text{rows}}) \\div \\text{Parallel Divisor}`
      );
      formulas.cpu_cost = katex.renderToString(
        `= (${node.cpu_per_tuple} \\times ${node.baserel_tuples} + ${node.pathtarget_cost} \\times ${node.rows}) \\div ${node.parallel_divisor} = ${node.cpu_run_cost}`
      );
    }

    return formulas;
  }

  if (node.node === "BitmapHeapScan") {
    let formulas = {
      total: katex.renderToString(
        `\\text{Startup Cost} + \\text{CPU Run Cost} + \\text{Disk Run Cost}`
      ),
      total_cost: katex.renderToString(
        `= ${node.startup_cost} + ${node.cpu_run_cost} + ${node.disk_run_cost} = ${node.total_cost}`
      ),
      disk: katex.renderToString(
        `\\text{Cost per Page} \\times N_{\\text{pages}}`
      ),
      disk_cost: katex.renderToString(
        `= ${node.cost_per_page} \\times ${node.pages_fetched} = ${node.disk_run_cost}`
      ),
    };

    if (node.parallel_workers === 0) {
      formulas.cpu = katex.renderToString(
        `\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}} + \\text{Target Cost per Tuple} \\times N_{\\text{rows}}`
      );
      formulas.cpu_cost = katex.renderToString(
        `= ${node.cpu_per_tuple} \\times ${node.tuples_fetched} + ${node.pathtarget_cost} \\times ${node.rows} = ${node.cpu_run_cost}`
      );
    } else {
      formulas.cpu = katex.renderToString(
        `(\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}} + \\text{Target Cost per Tuple} \\times N_{\\text{rows}}) \\div \\text{Parallel Divisor}`
      );
      formulas.cpu_cost = katex.renderToString(
        `= (${node.cpu_per_tuple} \\times ${node.tuples_fetched} + ${node.pathtarget_cost} \\times ${node.rows}) \\div ${node.parallel_divisor} = ${node.cpu_run_cost}`
      );
    }

    return formulas;
  }

  if (node.node === "SubqueryScan") {
    let formulas = {
      total: katex.renderToString(
        `\\text{Subpath Total Cost} + \\text{Startup Cost} + \\text{Run Cost}`
      ),
      total_cost: katex.renderToString(
        `= ${node.subpath_total_cost} + ${node.startup_cost} + ${
          node.run_cost
        } = ${node.subpath_total_cost + node.startup_cost + node.run_cost} = ${
          node.total_cost
        }`
      ),
      run: katex.renderToString(
        `\\text{CPU Cost per Tuple} \\times N_{\\text{subpath rows}} + \\text{Target Cost per Tuple} \\times N_{\\text{rows}}`
      ),
      run_cost: katex.renderToString(
        `= ${node.cpu_per_tuple} \\times ${node.subpath_rows} + ${
          node.pathtarget_cost
        } \\times ${node.rows} = ${
          node.cpu_per_tuple * node.subpath_rows +
          node.pathtarget_cost * node.rows
        } = ${node.run_cost}`
      ),
    };

    return formulas;
  }

  if (node.node === "Sort") {
    let formulas = {
      total: katex.renderToString(`\\text{Startup Cost} + \\text{Run Cost}`),
      total_cost: katex.renderToString(
        `= ${node.startup_cost} + ${node.run_cost} = ${node.total_cost}`
      ),
      run: katex.renderToString(
        `\\text{CPU Cost per Operator} \\times N_{\\text{rows}}`
      ),
      run_cost: katex.renderToString(
        `= ${node.cpu_operator_cost} \\times ${node.rows} = ${node.run_cost}`
      ),
    };

    return formulas;
  }

  if (node.node === "IncrementalSort") {
    let formulas = {
      total: katex.renderToString(`\\text{Startup Cost} + \\text{Run Cost}`),
      total_cost: katex.renderToString(
        `= ${node.startup_cost} + ${node.run_cost} = ${node.total_cost}`
      ),
    };

    formulas.run =
      katex.renderToString(
        `\\text{Group Run Cost} + (\\text{Group Run Cost} + \\text{Group Startup Cost}) \\times (N_\\text{groups} - 1) \\\\ \\qquad`
      ) +
      " " +
      katex.renderToString(
        `+ \\text{Group Input Run Cost} \\times (N_\\text{groups} - 1) \\\\ \\qquad \\qquad`
      ) +
      " " +
      katex.renderToString(
        `+ (\\text{CPU Cost per Tuple} + \\text{Comparison Cost}) \\times N_\\text{tuples} \\\\ \\qquad \\qquad \\qquad`
      ) +
      " " +
      katex.renderToString(
        `+ 2.0 \\times \\text{CPU Cost per Tuple} \\times N_\\text{groups}`
      );
    formulas.run_cost =
      katex.renderToString(
        `= ${node.group_run_cost} + (${node.group_run_cost} + ${node.group_startup_cost}) \\times ${node.input_groups} \\\\ \\qquad`
      ) +
      " " +
      katex.renderToString(
        `+ ${node.group_input_run_cost} \\times ${node.input_groups} \\\\ \\qquad \\qquad`
      ) +
      " " +
      katex.renderToString(
        `+ (${node.cpu_tuple_cost} + ${node.comparison_cost}) \\times ${node.rows} \\\\ \\qquad \\qquad \\qquad`
      ) +
      " " +
      katex.renderToString(
        `+ 2.0 \\times ${node.cpu_tuple_cost} \\times ${node.input_groups} = ${node.run_cost}`
      );

    return formulas;
  }

  if (node.node === "NestLoop") {
    let nqquad = 1;

    let formulas = {
      total: katex.renderToString(`\\text{Startup Cost} + \\text{Run Cost}`),
      total_cost: katex.renderToString(
        `= ${node.startup_cost} + ${node.run_cost} = ${node.total_cost}`
      ),
    };

    formulas.run = katex.renderToString(`\\text{Outer Run Cost}`);
    formulas.run_cost = katex.renderToString(
      `= ${node.initial_outer_path_run_cost}`
    );

    if (node.initial_outer_path_rows > 1) {
      formulas.run += " " + katex.renderToString(`+`) + " ";
      formulas.run_cost += " " + katex.renderToString(`+`) + " ";

      formulas.run += katex.renderToString(
        `(N_\\text{outer rows} - 1) \\times \\text{Inner Rescan Start Cost}`
      );
      formulas.run_cost += katex.renderToString(
        `(${node.initial_outer_path_rows} - 1) \\times ${node.initial_inner_rescan_start_cost}`
      );
    }

    if (!node.is_early_stop) {
      formulas.run += " " + katex.renderToString(`+`) + " ";
      formulas.run_cost += " " + katex.renderToString(`+`) + " ";

      formulas.run += katex.renderToString(`\\text{Inner Run Cost}`);
      formulas.run_cost += katex.renderToString(
        `${node.initial_inner_run_cost}`
      );

      if (node.initial_outer_path_rows > 1) {
        formulas.run += katex.renderToString(`\\\\`);
        formulas.run_cost += katex.renderToString(`\\\\`);

        for (let i = 0; i < nqquad; i++) {
          formulas.run += katex.renderToString(`\\qquad`);
          formulas.run_cost += katex.renderToString(`\\qquad`);
        }
        nqquad++;

        formulas.run +=
          katex.renderToString(`+`) +
          " " +
          katex.renderToString(
            `(N_\\text{outer rows} - 1) \\times \\text{Inner Rescan Run Cost}`
          );
        formulas.run_cost +=
          katex.renderToString(`+`) +
          " " +
          katex.renderToString(
            `(${node.initial_outer_path_rows} - 1) \\times ${node.initial_inner_rescan_run_cost}`
          );
      }
    }

    if (node.is_early_stop) {
      if (node.has_indexed_join_quals) {
        formulas.run += katex.renderToString(`\\\\`);
        formulas.run_cost += katex.renderToString(`\\\\`);

        for (let i = 0; i < nqquad; i++) {
          formulas.run += katex.renderToString(`\\qquad`);
          formulas.run_cost += katex.renderToString(`\\qquad`);
        }
        nqquad++;

        formulas.run +=
          katex.renderToString(`+`) +
          " " +
          katex.renderToString(
            `\\text{Inner Run Cost} \\times \\text{Inner Scan Frac}`
          );
        formulas.run_cost +=
          katex.renderToString(`+`) +
          " " +
          katex.renderToString(
            `${node.inner_run_cost} \\times ${node.inner_scan_frac}`
          );

        if (node.outer_matched_rows > 1) {
          formulas.run += katex.renderToString(`\\\\`);
          formulas.run_cost += katex.renderToString(`\\\\`);

          for (let i = 0; i < nqquad; i++) {
            formulas.run += katex.renderToString(`\\qquad`);
            formulas.run_cost += katex.renderToString(`\\qquad`);
          }
          nqquad++;

          formulas.run +=
            katex.renderToString(`+`) +
            " " +
            katex.renderToString(
              `(N_\\text{outer matched rows} - 1) \\times \\text{Inner Rescan Run Cost} \\times \\text{Inner Scan Frac}`
            );
          formulas.run_cost +=
            katex.renderToString(`+`) +
            " " +
            katex.renderToString(
              `(${node.outer_matched_rows} - 1) \\times ${node.inner_rescan_run_cost} \\times ${node.inner_scan_frac}`
            );
        }

        formulas.run += katex.renderToString(`\\\\`);
        formulas.run_cost += katex.renderToString(`\\\\`);

        for (let i = 0; i < nqquad; i++) {
          formulas.run += katex.renderToString(`\\qquad`);
          formulas.run_cost += katex.renderToString(`\\qquad`);
        }
        nqquad++;

        formulas.run +=
          katex.renderToString(`+`) +
          " " +
          katex.renderToString(
            `(N_\\text{outer unmatched rows} \\times \\text{Inner Rescan Run Cost}) \\div N_\\text{inner rows}`
          );
        formulas.run_cost +=
          katex.renderToString(`+`) +
          " " +
          katex.renderToString(
            `(${node.outer_unmatched_rows} \\times ${node.inner_rescan_run_cost}) \\div ${node.inner_path_rows}`
          );
      } else {
        formulas.run += " " + katex.renderToString(`+`) + " ";
        formulas.run_cost += " " + katex.renderToString(`+`) + " ";

        formulas.run += katex.renderToString(`\\text{Inner Run Cost}`);
        formulas.run_cost += katex.renderToString(`${node.inner_run_cost}`);

        if (node.outer_matched_rows > 0) {
          formulas.run += katex.renderToString(`\\\\`);
          formulas.run_cost += katex.renderToString(`\\\\`);

          for (let i = 0; i < nqquad; i++) {
            formulas.run += katex.renderToString(`\\qquad`);
            formulas.run_cost += katex.renderToString(`\\qquad`);
          }
          nqquad++;

          formulas.run +=
            katex.renderToString(`+`) +
            " " +
            katex.renderToString(
              `N_\\text{outer matched rows} \\times \\text{Inner Rescan Run Cost} \\times \\text{Inner Scan Frac}`
            );
          formulas.run_cost +=
            katex.renderToString(`+`) +
            " " +
            katex.renderToString(
              `${node.outer_matched_rows} \\times ${node.inner_rescan_run_cost} \\times ${node.inner_scan_frac}`
            );
        }

        if (node.outer_unmatched_rows > 0) {
          formulas.run += katex.renderToString(`\\\\`);
          formulas.run_cost += katex.renderToString(`\\\\`);

          for (let i = 0; i < nqquad; i++) {
            formulas.run += katex.renderToString(`\\qquad`);
            formulas.run_cost += katex.renderToString(`\\qquad`);
          }
          nqquad++;

          formulas.run +=
            katex.renderToString(`+`) +
            " " +
            katex.renderToString(
              `N_\\text{outer unmatched rows} \\times \\text{Inner Rescan Run Cost}`
            );
          formulas.run_cost +=
            katex.renderToString(`+`) +
            " " +
            katex.renderToString(
              `${node.outer_unmatched_rows} \\times ${node.inner_rescan_run_cost}`
            );
        }
      }
    }

    formulas.run += katex.renderToString(`\\\\`);
    formulas.run_cost += katex.renderToString(`\\\\`);

    for (let i = 0; i < nqquad; i++) {
      formulas.run += katex.renderToString(`\\qquad`);
      formulas.run_cost += katex.renderToString(`\\qquad`);
    }

    formulas.run +=
      katex.renderToString(`+`) +
      " " +
      katex.renderToString(
        `\\text{CPU Cost per Tuple} \\times N_\\text{total tuples} + \\text{Join Cost per Tuple} \\times N_\\text{join tuples}`
      );
    formulas.run_cost +=
      katex.renderToString(`+`) +
      " " +
      katex.renderToString(
        `${node.cpu_per_tuple} \\times ${node.ntuples} + ${node.cost_per_tuple} \\times ${node.rows}`
      );

    formulas.run_cost += " " + katex.renderToString(`= ${node.run_cost}`);

    return formulas;
  }

  if (node.node === "MergeJoin") {
    let formulas = {
      total: katex.renderToString(`\\text{Startup Cost} + \\text{Run Cost}`),
      total_cost: katex.renderToString(
        `= ${node.startup_cost} + ${node.run_cost} = ${node.total_cost}`
      ),
    };

    if (node.sortouter) {
      formulas.run = katex.renderToString(
        `\\text{Sort Run Cost} \\times \\text{Outer Selectivity}`
      );
      formulas.run_cost = katex.renderToString(
        `${node.initial_sort_path_run_cost} \\times ${node.initial_outer_sel}`
      );
    } else {
      formulas.run = katex.renderToString(
        `\\text{Outer Run Cost} \\times \\text{Outer Selectivity}`
      );
      formulas.run_cost = katex.renderToString(
        `= ${node.initial_outer_path_run_cost} \\times ${node.initial_outer_sel}`
      );
    }

    if (node.matinner) {
      formulas.run +=
        " " +
        katex.renderToString(`+`) +
        " " +
        katex.renderToString(`\\text{Materialized Inner Cost}`);
      formulas.run_cost +=
        " " +
        katex.renderToString(`+`) +
        " " +
        katex.renderToString(`${node.mat_inner_cost}`);
    } else {
      formulas.run +=
        " " +
        katex.renderToString(`+`) +
        " " +
        katex.renderToString(`\\text{Bare Inner Cost}`);
      formulas.run_cost +=
        " " +
        katex.renderToString(`+`) +
        " " +
        katex.renderToString(`${node.bare_inner_cost}`);
    }

    formulas.run +=
      katex.renderToString(`\\\\ \\qquad +`) +
      " " +
      katex.renderToString(
        `\\text{Merge Qual Cost per Tuple} \\times \\{(N_\\text{outer rows} - N_\\text{outer skip rows}) + (N_\\text{inner rows} - N_\\text{inner skip rows}) \\times \\text{Rescan Ratio})\\}`
      ) +
      katex.renderToString(`\\\\ \\qquad \\qquad +`) +
      " " +
      katex.renderToString(
        `\\text{CPU Cost per Tuple} \\times N_\\text{merge join tuples} + \\text{Join Cost per Tuple} \\times N_\\text{join tuples}`
      );
    formulas.run_cost +=
      katex.renderToString(`\\\\ \\qquad +`) +
      " " +
      katex.renderToString(
        `${node.merge_qual_cost} \\times \\{(${node.outer_rows} - ${node.outer_skip_rows}) + (${node.inner_rows} - ${node.inner_skip_rows}) \\times ${node.rescanratio})\\}`
      ) +
      katex.renderToString(`\\\\ \\qquad \\qquad +`) +
      " " +
      katex.renderToString(
        `${node.cpu_per_tuple} \\times ${node.mergejointuples} + ${node.cost_per_tuple} \\times ${node.rows}`
      );

    formulas.run_cost += " " + katex.renderToString(`= ${node.run_cost}`);

    return formulas;
  }

  if (node.node === "HashJoin") {
    let nqquad = 1;

    let formulas = {
      total: katex.renderToString(`\\text{Startup Cost} + \\text{Run Cost}`),
      total_cost: katex.renderToString(
        `= ${node.startup_cost} + ${node.run_cost} = ${node.total_cost}`
      ),
    };

    formulas.run = katex.renderToString(
      `\\text{Outer Run Cost} + \\text{CPU Cost per Operator} \\times N_\\text{hash clauses} \\times N_\\text{outer rows}`
    );
    formulas.run_cost = katex.renderToString(
      `= ${node.initial_outer_path_run_cost} + ${node.initial_cpu_operator_cost} \\times ${node.initial_num_hashclauses} \\times ${node.initial_outer_path_rows}`
    );

    if (node.initial_numbatches > 1) {
      formulas.run += katex.renderToString(`\\\\`);
      formulas.run_cost += katex.renderToString(`\\\\`);

      for (let i = 0; i < nqquad; i++) {
        formulas.run += katex.renderToString(`\\qquad`);
        formulas.run_cost += katex.renderToString(`\\qquad`);
      }
      nqquad++;

      formulas.run +=
        katex.renderToString(`+`) +
        " " +
        katex.renderToString(
          `\\text{Sequential Page Cost} \\times (N_\\text{inner pages} + 2 \\times N_\\text{outer pages})`
        );
      formulas.run_cost +=
        katex.renderToString(`+`) +
        " " +
        katex.renderToString(
          `${node.initial_seq_page_cost} \\times (${node.initial_innerpages} + 2 \\times ${node.initial_outerpages})`
        );
    }

    if (node.is_early_stop) {
      formulas.run += katex.renderToString(`\\\\`);
      formulas.run_cost += katex.renderToString(`\\\\`);

      for (let i = 0; i < nqquad; i++) {
        formulas.run += katex.renderToString(`\\qquad`);
        formulas.run_cost += katex.renderToString(`\\qquad`);
      }
      nqquad++;

      formulas.run +=
        katex.renderToString(`+`) +
        " " +
        katex.renderToString(
          `\\text{Hash Qual Cost per Tuple} \\times N_\\text{outer matched rows} \\times N_\\text{inner bucket rows} \\times 0.5`
        );
      formulas.run_cost +=
        katex.renderToString(`+`) +
        " " +
        katex.renderToString(
          `${node.hash_qual_cost} \\times ${node.outer_matched_rows} \\times ${node.matched_bucket_rows} \\times 0.5`
        );

      formulas.run += katex.renderToString(`\\\\`);
      formulas.run_cost += katex.renderToString(`\\\\`);

      for (let i = 0; i < nqquad; i++) {
        formulas.run += katex.renderToString(`\\qquad`);
        formulas.run_cost += katex.renderToString(`\\qquad`);
      }
      nqquad++;

      formulas.run +=
        katex.renderToString(`+`) +
        " " +
        katex.renderToString(
          `\\text{Hash Qual Cost per Tuple} \\times N_\\text{outer unmatched rows} \\times N_\\text{inner bucket rows} \\times 0.05`
        );
      formulas.run_cost +=
        katex.renderToString(`+`) +
        " " +
        katex.renderToString(
          `${node.hash_qual_cost} \\times ${node.outer_unmatched_rows} \\times ${node.unmatched_bucket_rows} \\times 0.05`
        );
    } else {
      formulas.run += katex.renderToString(`\\\\`);
      formulas.run_cost += katex.renderToString(`\\\\`);

      for (let i = 0; i < nqquad; i++) {
        formulas.run += katex.renderToString(`\\qquad`);
        formulas.run_cost += katex.renderToString(`\\qquad`);
      }
      nqquad++;

      formulas.run +=
        katex.renderToString(`+`) +
        " " +
        katex.renderToString(
          `\\text{Hash Qual Cost per Tuple} \\times N_\\text{outer rows} \\times N_\\text{inner bucket rows} * 0.5`
        );
      formulas.run_cost +=
        katex.renderToString(`+`) +
        " " +
        katex.renderToString(
          `${node.hash_qual_cost} \\times ${node.outer_path_rows} \\times ${node.bucket_rows} \\times 0.5`
        );
    }

    formulas.run += katex.renderToString(`\\\\`);
    formulas.run_cost += katex.renderToString(`\\\\`);

    for (let i = 0; i < nqquad; i++) {
      formulas.run += katex.renderToString(`\\qquad`);
      formulas.run_cost += katex.renderToString(`\\qquad`);
    }
    nqquad++;

    formulas.run +=
      katex.renderToString(`+`) +
      " " +
      katex.renderToString(
        `\\text{CPU Cost per Tuple} \\times N_\\text{hash join tuples} + \\text{Join Cost per Tuple} \\times N_\\text{join tuples}`
      );
    formulas.run_cost +=
      katex.renderToString(`+`) +
      " " +
      katex.renderToString(
        `${node.cpu_per_tuple} \\times ${node.hashjointuples} + ${node.cost_per_tuple} \\times ${node.rows}`
      );

    formulas.run_cost += " " + katex.renderToString(`= ${node.run_cost}`);

    return formulas;
  }

  if (node.node === "CteScan") {
    let formulas = {
      total: katex.renderToString(`\\text{Startup Cost} + \\text{Run Cost}`),
      total_cost: katex.renderToString(
        `= ${node.startup_cost} + ${node.run_cost} = ${
          node.startup_cost + node.run_cost
        }`
      ),
      run: katex.renderToString(
        `\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}} + \\text{Target Cost per Tuple} \\times N_{\\text{rows}}`
      ),
      run_cost: katex.renderToString(
        `= ${node.cpu_per_tuple} \\times ${node.baserel_tuples} + ${node.pathtarget_cost} \\times ${node.rows} = ${node.run_cost}`
      ),
    };

    return formulas;
  }

  if (node.node === "MergeAppend") {
    const logm = Math.log2(node.n_streams < 2 ? 2 : node.n_streams);
    let formulas = {
      total: katex.renderToString(`\\text{Startup Cost} + \\text{Run Cost}`),
      total_cost: katex.renderToString(
        `= ${node.startup_cost} + ${node.run_cost} = ${node.total_cost}`
      ),
      run: katex.renderToString(
        `(N_{\\text{rows}} \\times \\text{Comparison Cost} \\times \\log_2 M) + (\\text{CPU Operator Cost} \\times N_{\\text{rows}})`
      ),
      run_cost: katex.renderToString(
        `= (${node.rows} \\times ${node.comparison_cost} \\times ${logm}) + (${
          node.cpu_tuple_cost * node.multiplier
        } \\times ${node.rows}) = ${node.run_cost}`
      ),
    };

    return formulas;
  }

  if (node.node === "Append") {
    if (node.parallel_aware === 0) {
      let formulas = {
        total: katex.renderToString(`\\text{Run Cost}`),
        total_cost: katex.renderToString(`= ${node.total_cost}`),
        run: katex.renderToString(
          `\\text{Subpath Cost} + \\text{CPU Cost per Tuple} \\times N_{\\text{rows}}`
        ),
        run_cost: katex.renderToString(
          `= ${node.nonpartial_cost} + ${
            node.cpu_tuple_cost * node.multiplier
          } \\times ${node.rows} = ${node.total_cost}`
        ),
      };

      return formulas;
    }

    let formulas = {
      total: katex.renderToString(`\\text{Run Cost}`),
      total_cost: katex.renderToString(`= ${node.total_cost}`),
      run: katex.renderToString(
        `\\text{Subpath Partial Cost} + \\text{Subpath Non-Partial Cost} + \\text{CPU Cost per Tuple} \\times N_{\\text{rows}}`
      ),
      run_cost: katex.renderToString(
        `= ${node.partial_cost} + ${node.nonpartial_cost} + ${
          node.cpu_tuple_cost * node.multiplier
        } \\times ${node.rows} = ${node.total_cost}`
      ),
    };

    return formulas;
  }
};
