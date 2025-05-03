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
      total_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>Total Cost: Sum of startup, CPU run, and disk run costs.</li>
            <li>
              Startup Cost: Cost incurred before the first tuple is fetched,
              including:
              <ul className="list-disc list-outside ml-4 mt-1 text-rxsm space-y-1">
                <li>
                  Qual Evaluation Cost: Cost of evaluating restriction clauses
                  before execution.
                </li>
                <li>
                  Target Cost: Cost of evaluating the target list per output
                  row.
                </li>
                <li>
                  Disable Cost: Penalty added if sequential scan is disabled by
                  planner configuration.
                </li>
              </ul>
            </li>
            <li>
              CPU Run Cost: Cost of evaluating all tuples and target
              expressions.
            </li>
            <li>
              Disk Run Cost: Cost of reading all pages from disk sequentially.
            </li>
          </ul>
        </>
      ),

      disk: katex.renderToString(
        `\\text{Sequential Page Cost} \\times N_{\\text{pages}}`
      ),
      disk_cost: katex.renderToString(
        `= ${node.spc_seq_page_cost} \\times ${node.baserel_pages} = ${node.disk_run_cost}`
      ),
      disk_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              Sequential Page Cost: Cost of fetching one page from disk
              sequentially.
            </li>
            <li>
              N<sub>pages</sub>: Total number of pages in the base relation.
            </li>
          </ul>
        </>
      ),

      cpu_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              CPU Cost per Tuple: Sum of base tuple processing cost and qual
              evaluation per tuple.
            </li>
            <li>
              Target Cost per Tuple: Cost of computing the target list for each
              output row.
            </li>
            <li>
              N<sub>tuples</sub>: Number of tuples in the base relation to
              process.
            </li>
            <li>
              N<sub>rows</sub>: Number of output rows after filtering.
            </li>
            {node.parallel_workers > 0 && (
              <li>
                Parallel Divisor: Factor used to divide CPU cost among workers.
              </li>
            )}
          </ul>
        </>
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
      total_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>Total Cost: Sum of startup and run costs.</li>
            <li>
              Startup Cost: Cost incurred before the first tuple is fetched,
              consisting of:
              <ul className="list-disc list-outside ml-4 mt-1 text-rxsm space-y-1">
                <li>
                  Subpath Startup Cost: Cost of executing the underlying plan
                  until the first tuple is available.
                </li>
                <li>
                  Parallel Setup Cost: Overhead of initializing parallel
                  execution infrastructure.
                </li>
              </ul>
            </li>
            <li>
              Run Cost: Cost of fetching all tuples from parallel workers.
            </li>
          </ul>
        </>
      ),

      run: katex.renderToString(
        `\\text{Subpath Cost} + \\text{Parallel Cost per Tuple} \\times N_{\\text{rows}}`
      ),
      run_cost: katex.renderToString(
        `= ${node.subpath_cost} + ${node.parallel_tuple_cost} \\times ${node.rows} = ${node.run_cost}`
      ),
      run_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              Subpath Cost: Cost of running the underlying plan after startup.
            </li>
            <li>
              Parallel Tuple Cost: Cost of transferring each tuple from worker
              to leader process.
            </li>
            <li>
              N<sub>rows</sub>: Number of tuples returned by all workers.
            </li>
          </ul>
        </>
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
      total_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              Total Cost: Sum of startup cost, run cost, and input total cost.
            </li>
            <li>
              Startup Cost: Cost incurred before the first tuple is fetched,
              consisting of:
              <ul className="list-disc list-outside ml-4 mt-1 text-rxsm space-y-1">
                <li>
                  Disable Cost: Penalty added if Gather Merge is disabled by
                  configuration.
                </li>
                <li>
                  Heap Creation Cost: Cost of building a priority queue from
                  sorted streams (N × log₂N comparisons).
                </li>
                <li>
                  Parallel Setup Cost: Cost of initializing the parallel
                  execution infrastructure.
                </li>
              </ul>
            </li>
            <li>Run Cost: Cost of merging and transferring all tuples.</li>
            <li>
              Input Total Cost: Cost of executing the subplan that produces
              sorted streams.
            </li>
          </ul>
        </>
      ),

      run: katex.renderToString(
        `N_{\\text{rows}} \\times \\text{Comparison Cost} \\times \\log_2 N_{workers} \\\\ \\qquad + \\text{CPU Cost per Operator} \\times N_{\\text{rows}} \\\\ \\qquad \\qquad + \\text{Parallel Cost per Tuple} \\times N_{\\text{rows}} \\times 1.05`
      ),
      run_cost: katex.renderToString(
        `= ${node.rows} \\times ${node.comparison_cost} \\times ${node.logN} \\\\ \\qquad + ${node.cpu_operator_cost} \\times ${node.rows} \\\\ \\qquad \\qquad + ${node.parallel_tuple_cost} \\times ${node.rows} \\times 1.05 = ${node.run_cost}`
      ),
      run_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              N<sub>rows</sub>: Number of output tuples from Gather Merge.
            </li>
            <li>
              Comparison Cost: Cost of comparing tuples during heap operations
              (2 × cpu_operator_cost).
            </li>
            <li>
              log₂ N_workers: Logarithmic factor based on number of input
              streams (workers + leader).
            </li>
            <li>
              CPU Cost per Operator: Cost of basic heap operations beyond
              comparisons.
            </li>
            <li>
              Parallel Tuple Cost: Cost of transferring a tuple from a worker to
              the leader process.
            </li>
            <li>
              1.05 Factor: Additional 5% cost due to blocking behavior of Gather
              Merge.
            </li>
          </ul>
        </>
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
      total_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              Total Cost: Sum of startup, index scan, CPU run, and disk run
              costs.
            </li>
            <li>
              Startup Cost: Cost incurred before the first tuple is fetched,
              including:
              <ul className="list-disc list-outside ml-4 mt-1 text-rxsm space-y-1">
                <li>
                  Disable Cost: Penalty applied when index scan is disabled via
                  configuration.
                </li>
                <li>Index Startup Cost: Cost to begin accessing the index.</li>
                <li>
                  Startup Qual Cost: One-time cost to evaluate restriction
                  clauses.
                </li>
                <li>
                  Target Startup Cost: One-time cost to evaluate target
                  expressions.
                </li>
              </ul>
            </li>
            <li>
              Index Scan Cost: Cost of traversing the index to find matching
              tuples.
            </li>
            <li>
              CPU Run Cost: Cost of evaluating WHERE clause and target list per
              tuple.
            </li>
            <li>
              Disk Run Cost: Estimated I/O cost of fetching matching tuples from
              the heap.
            </li>
          </ul>
        </>
      ),

      disk: katex.renderToString(
        `\\text{Max IO Cost} +  \\text{Correlation}^2 \\times (\\text{Min IO Cost} - \\text{Max IO Cost})`
      ),
      disk_cost: katex.renderToString(
        `= ${node.max_io_cost} + ${node.index_correlation}^2 \\times (${node.min_io_cost} - ${node.max_io_cost}) = ${node.disk_run_cost}`
      ),
      disk_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              Max IO Cost: Estimated I/O cost assuming random access (no
              correlation between index and heap).
            </li>
            <li>
              Min IO Cost: Estimated I/O cost assuming full correlation
              (sequential heap access).
            </li>
            <li>
              Correlation²: Squared correlation factor used to interpolate
              between max and min I/O cost.
            </li>
          </ul>
        </>
      ),

      cpu_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              CPU Cost per Tuple: Sum of base tuple processing cost and
              per-tuple restriction clause cost.
            </li>
            <li>
              Target Cost per Tuple: Cost of computing target list expressions
              per output row.
            </li>
            <li>
              N<sub>tuples</sub>: Number of base table tuples fetched using the
              index.
            </li>
            <li>
              N<sub>rows</sub>: Number of output rows after filtering.
            </li>
            {node.parallel_workers > 0 && (
              <li>
                Parallel Divisor: Number of workers (including leader) among
                which CPU cost is divided.
              </li>
            )}
          </ul>
        </>
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
      total_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>Total Cost: Sum of startup, CPU run, and disk run costs.</li>
            <li>
              Startup Cost: Includes the cost of evaluating the bitmap index
              (indexTotalCost), startup costs of restriction clauses, and target
              list startup cost.
            </li>
            <li>
              CPU Run Cost: Cost of evaluating WHERE clause per tuple and target
              list per output row.
            </li>
            <li>
              Disk Run Cost: I/O cost for fetching heap pages matched by the
              bitmap index.
            </li>
          </ul>
        </>
      ),

      disk: katex.renderToString(
        `\\text{Cost per Page} \\times N_{\\text{pages}}`
      ),
      disk_cost: katex.renderToString(
        `= ${node.cost_per_page} \\times ${node.pages_fetched} = ${node.disk_run_cost}`
      ),
      disk_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              Cost per Page: Interpolated value between random and sequential
              page cost based on the ratio of pages fetched to total table size.
            </li>
            <li>
              N<sub>pages</sub>: Estimated number of heap pages fetched using
              the bitmap index.
            </li>
          </ul>
        </>
      ),

      cpu_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              CPU Cost per Tuple: Sum of base tuple processing cost and
              restriction clause evaluation per tuple.
            </li>
            <li>
              Target Cost per Tuple: Cost of computing target list expressions
              per output row.
            </li>
            <li>
              N<sub>tuples</sub>: Estimated number of tuples retrieved from
              heap.
            </li>
            <li>
              N<sub>rows</sub>: Number of output rows after filtering.
            </li>
            {node.parallel_workers > 0 && (
              <li>
                Parallel Divisor: Number of workers (including leader) among
                which CPU cost is divided.
              </li>
            )}
          </ul>
        </>
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
      total_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              Total Cost: Sum of subpath cost, startup cost, and run cost.
            </li>
            <li>
              Subpath Total Cost: Cost of executing the underlying subquery.
            </li>
            <li>
              Startup Cost: Includes cost of evaluating WHERE clause
              (restriction) and startup cost of target list.
            </li>
            <li>
              Run Cost: CPU cost for filtering and projecting output tuples.
            </li>
          </ul>
        </>
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
      run_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              CPU Cost per Tuple: Sum of base processing cost and restriction
              clause evaluation per tuple.
            </li>
            <li>
              Target Cost per Tuple: Cost of evaluating expressions in the
              target list per output row.
            </li>
            <li>
              N_subpath_rows: Estimated number of rows from the subquery before
              filtering.
            </li>
            <li>
              N<sub>rows</sub>: Estimated number of output rows after applying
              restriction clauses.
            </li>
          </ul>
        </>
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
      total_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>Total Cost: Sum of startup cost and run cost.</li>
            <li>
              Startup Cost: Includes input cost and cost of performing sort
              based on tuple volume, width, and work memory.
            </li>
            <li>
              Run Cost: Cost of extracting sorted tuples after sorting
              completes.
            </li>
          </ul>
        </>
      ),

      run: katex.renderToString(
        `\\text{CPU Cost per Operator} \\times N_{\\text{rows}}`
      ),
      run_cost: katex.renderToString(
        `= ${node.cpu_operator_cost} \\times ${node.rows} = ${node.run_cost}`
      ),
      run_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              CPU Cost per Operator: Default 2× operator cost per comparison.
            </li>
            <li>
              N<sub>rows</sub>: Number of tuples to be sorted.
            </li>
          </ul>
        </>
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
      total_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>Total Cost: Sum of startup and run costs.</li>
            <li>
              Startup Cost: Cost incurred before the first output tuple is
              produced, including:
              <ul className="list-disc list-outside ml-4 mt-1 text-rxsm space-y-1">
                <li>
                  Group Startup Cost: One-time cost of sorting the first group
                  using tuplesort.
                </li>
                <li>
                  Input Startup Cost: Cost of producing the first tuple from the
                  input path.
                </li>
                <li>
                  Group Input Run Cost: Proportional portion of the input’s run
                  cost for the first group.
                </li>
              </ul>
            </li>
            <li>
              Run Cost: Cost of processing and sorting all groups after the
              first one, plus per-tuple overhead.
            </li>
          </ul>
        </>
      ),

      run_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              Group Run Cost: Cost of producing all tuples in a single sorted
              group.
            </li>
            <li>
              Group Startup Cost: One-time initialization cost for sorting a
              group (repeated for all but the first group).
            </li>
            <li>
              Group Input Run Cost: Portion of the input’s run cost attributed
              to each group, repeated for all but the first group.
            </li>
            <li>
              CPU Cost per Tuple: Basic processing cost of each tuple in group
              detection.
            </li>
            <li>
              Comparison Cost: Additional cost of comparing tuples to detect
              group boundaries.
            </li>
            <li>
              2.0 Factor: Models the reset overhead using two times the CPU cost
              per group.
            </li>
            <li>
              N<sub>tuples</sub>: Number of tuples in the input path to be
              incrementally sorted.
            </li>
            <li>
              N<sub>groups</sub>: Estimated number of groups with identical
              presorted keys.
            </li>
          </ul>
        </>
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
      total_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>Total Cost: Sum of startup and run costs.</li>
            <li>
              Startup Cost: Cost incurred before producing the first joined
              tuple, including:
              <ul className="list-disc list-outside ml-4 mt-1 text-rxsm space-y-1">
                <li>
                  Outer Startup Cost: Cost to initialize and begin the outer
                  input path.
                </li>
                <li>
                  Inner Startup Cost: Cost to initialize the inner input path
                  before first execution.
                </li>
                <li>
                  Join Qual Startup Cost: One-time cost to initialize join
                  restriction evaluation.
                </li>
                <li>
                  Target Startup Cost: One-time cost to evaluate expressions in
                  the join output list.
                </li>
                <li>
                  Disable Cost: Penalty added when nested loop joins are
                  disabled in configuration.
                </li>
              </ul>
            </li>
            <li>
              Run Cost: Cost of executing the join across all outer and inner
              tuples.
            </li>
          </ul>
        </>
      ),

      run_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              Outer Run Cost: Cost to fully execute the outer input path,
              excluding its startup cost.
            </li>
            <li>
              Inner Rescan Start Cost: One-time startup cost to reinitialize the
              inner plan for each additional outer tuple.
            </li>
            <li>
              Inner Run Cost: Cost of executing the inner path once (excluding
              startup cost), paid fully for the first outer row.
            </li>
            <li>
              Inner Rescan Run Cost: Cost to re-execute the inner path for each
              additional outer row, excluding startup.
            </li>
            <li>
              Inner Scan Frac: Expected fraction of the inner input scanned when
              using SEMI/ANTI joins with early exit optimization.
            </li>
            <li>
              N<sub>outer rows</sub>: Number of rows in the outer input path.
            </li>
            <li>
              N<sub>outer matched rows</sub>: Estimated number of outer rows
              that match at least one tuple from the inner input.
            </li>
            <li>
              N<sub>outer unmatched rows</sub>: Estimated number of outer rows
              that do not match any tuple from the inner input.
            </li>
            <li>
              N<sub>inner rows</sub>: Number of rows in the inner input path.
            </li>
            <li>
              CPU Cost per Tuple: Cost of evaluating the join’s restriction
              conditions per joined tuple.
            </li>
            <li>
              Join Cost per Tuple: Cost of evaluating the final join target list
              expressions per output row.
            </li>
            <li>
              N<sub>total tuples</sub>: Total number of tuples scanned (outer ×
              inner), used to compute CPU cost for evaluating join conditions.
            </li>
            <li>
              N<sub>join tuples</sub>: Number of joined output rows (after
              applying restriction and target list), used for target cost
              computation.
            </li>
          </ul>
        </>
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
      total_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>Total Cost: Sum of startup and run costs.</li>
            <li>
              Startup Cost: Cost incurred before emitting the first output
              tuple, including:
              <ul className="list-disc list-outside ml-4 mt-1 text-rxsm space-y-1">
                <li>
                  Outer Startup: Cost to initialize the outer input, including
                  sorting if required.
                </li>
                <li>
                  Inner Startup: Cost to initialize the inner input, including
                  sorting if required.
                </li>
                <li>
                  Merge Qual Startup: One-time cost to initialize merge clause
                  evaluation.
                </li>
                <li>
                  Join Restriction Startup: One-time cost to initialize other
                  restriction clauses.
                </li>
                <li>Target Startup: Cost to initialize output expressions.</li>
                <li>
                  Disable Cost: Penalty if merge join is disabled via planner
                  configuration.
                </li>
              </ul>
            </li>
            <li>
              Run Cost: Cost of producing all output tuples from the merge join.
            </li>
          </ul>
        </>
      ),

      run_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              Outer Selectivity: Fraction of outer tuples processed after
              skipping initial non-matching rows.
            </li>
            <li>
              Inner Selectivity: Fraction of inner tuples processed, adjusted
              for matching range.
            </li>
            <li>
              Sort Run Cost: Cost of executing external sort for the outer (or
              inner) relation if sorting is required.
            </li>
            <li>
              Outer Run Cost: Cost of scanning outer tuples (if already sorted).
            </li>
            <li>
              Materialized Inner Cost: Total cost of reading inner tuples with
              materialization.
            </li>
            <li>
              Bare Inner Cost: Cost of scanning inner tuples without
              materialization, adjusted by rescan ratio.
            </li>
            <li>
              Rescan Ratio: Ratio representing how many times inner tuples are
              re-fetched due to duplicate keys.
            </li>
            <li>
              Merge Qual Cost per Tuple: Cost of evaluating merge clauses per
              comparison between tuples.
            </li>
            <li>
              N<sub>outer rows</sub>: Number of outer tuples considered after
              filtering.
            </li>
            <li>
              N<sub>outer skip rows</sub>: Number of outer tuples skipped before
              merging starts.
            </li>
            <li>
              N<sub>inner rows</sub>: Number of inner tuples considered after
              filtering.
            </li>
            <li>
              N<sub>inner skip rows</sub>: Number of inner tuples skipped before
              merging starts.
            </li>
            <li>
              CPU Cost per Tuple: Cost of evaluating remaining join conditions
              for each output pair.
            </li>
            <li>
              N<sub>merge join tuples</sub>: Number of tuples matched by merge
              condition.
            </li>
            <li>
              Join Target Cost per Tuple: Cost of computing the output
              expression for each final joined row.
            </li>
          </ul>
        </>
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
      total_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>Total Cost: Sum of startup and run costs.</li>
            <li>
              Startup Cost: Cost incurred before emitting the first output
              tuple, including:
              <ul className="list-disc list-outside ml-4 mt-1 text-rxsm space-y-1">
                <li>
                  Outer Startup Cost: Cost to initialize and scan outer input.
                </li>
                <li>
                  Inner Total Cost: Full cost to read inner input for building
                  the hash table.
                </li>
                <li>
                  Hash Table Build Cost:
                  <ul className="list-disc list-outside ml-4 mt-1 space-y-1 text-rxsm">
                    <li>
                      Hashing each inner tuple (operator and tuple costs).
                    </li>
                    <li>
                      Extra disk I/O if batching is needed (when numbatches &gt;
                      1).
                    </li>
                  </ul>
                </li>
                <li>
                  Hash Qual Startup: One-time cost for evaluating hash join
                  conditions.
                </li>
                <li>
                  Join Restriction Startup: One-time cost for applying
                  additional join filters.
                </li>
                <li>
                  Target Startup: Cost to initialize output expression
                  evaluation.
                </li>
                <li>Disable Cost: Penalty added if hash join is disabled.</li>
              </ul>
            </li>
            <li>Run Cost: Cost of producing all output tuples.</li>
          </ul>
        </>
      ),

      run_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>Outer Run Cost:Cost of executing the outer input.</li>
            <li>
              CPU Cost per Operator: Cost of applying one hash function per
              column in a hash clause.
            </li>
            <li>
              N<sub>hash clauses</sub>: Number of hash clauses (i.e., join
              conditions used for hashing).
            </li>
            <li>
              N<sub>outer rows</sub>: Number of tuples produced by the outer
              path.
            </li>
            <li>
              Sequential Page Cost: Cost of sequential I/O for reading or
              writing a disk page.
            </li>
            <li>
              N<sub>inner pages</sub>: Number of pages required to store the
              inner relation.
            </li>
            <li>
              N<sub>outer pages</sub>: Number of pages required to store the
              outer relation.
            </li>
            <li>
              Hash Qual Cost per Tuple: Cost of evaluating the hash join
              condition per tuple.
            </li>
            <li>
              N<sub>outer matched rows</sub>: Number of outer tuples expected to
              match at least one inner tuple.
            </li>
            <li>
              N<sub>outer unmatched rows</sub>: Number of outer tuples with no
              inner match.
            </li>
            <li>
              N<sub>inner bucket rows</sub>: Average number of inner tuples in
              each hash bucket.
            </li>
            <li>
              CPU Cost per Tuple: Cost to evaluate restriction clauses and
              process each joined tuple.
            </li>
            <li>
              N<sub>hash join tuples</sub>: Number of tuples expected to pass
              the hash join condition.
            </li>
            <li>
              Join Cost per Tuple: Cost to evaluate target list expressions for
              each output tuple.
            </li>
            <li>
              N<sub>join tuples</sub>: Estimated number of final output tuples.
            </li>
          </ul>
        </>
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
      total_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>Total Cost: Sum of startup and run costs.</li>
            <li>
              Startup Cost: Cost of evaluating restriction clauses and
              initializing the target list expressions before the scan begins.
            </li>
            <li>
              Run Cost: Cost of scanning all tuples from the tuplestore,
              applying restriction clauses, and evaluating target list
              expressions for each output row.
            </li>
          </ul>
        </>
      ),

      run: katex.renderToString(
        `\\text{CPU Cost per Tuple} \\times N_{\\text{tuples}} + \\text{Target Cost per Tuple} \\times N_{\\text{rows}}`
      ),
      run_cost: katex.renderToString(
        `= ${node.cpu_per_tuple} \\times ${node.baserel_tuples} + ${node.pathtarget_cost} \\times ${node.rows} = ${node.run_cost}`
      ),
      run_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              CPU Cost per Tuple: Cost of processing each tuple from the
              tuplestore, including restriction clause evaluation and tuple
              retrieval.
            </li>
            <li>
              N<sub>tuples</sub>: Estimated number of tuples stored in the
              tuplestore, i.e., the total number of tuples produced by the
              underlying CTE.
            </li>
            <li>
              Target Cost per Tuple: Cost of evaluating the target list
              expressions for each output row.
            </li>
            <li>
              N<sub>rows</sub>: Estimated number of final output rows from the
              CTE scan, after applying restriction clauses and projections.
            </li>
          </ul>
        </>
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
      total_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>Total Cost: Sum of startup and run costs.</li>
            <li>
              Startup Cost: Cost to initialize the merge heap with the first
              tuple from each input stream.
            </li>
            <li>
              Run Cost: Cost of maintaining the heap during tuple output and a
              small per-tuple processing overhead.
            </li>
          </ul>
        </>
      ),

      run: katex.renderToString(
        `N_{\\text{rows}} \\times \\text{Comparison Cost} \\times \\log_2 M + \\text{CPU Operator Cost} \\times N_{\\text{rows}}`
      ),
      run_cost: katex.renderToString(
        `= ${node.rows} \\times ${node.comparison_cost} \\times ${logm} + ${
          node.cpu_tuple_cost * node.multiplier
        } \\times ${node.rows} = ${node.run_cost}`
      ),
      run_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              N<sub>rows</sub>: Number of tuples to be output from all input
              streams.
            </li>
            <li>
              Comparison Cost: Cost of comparing two tuples based on sort keys.
            </li>
            <li>M: Number of input streams merged.</li>
            <li>
              log₂(M): Logarithmic cost factor due to maintaining a binary heap
              of size M.
            </li>
            <li>
              CPU Operator Cost: Overhead per output tuple to reflect
              MergeAppend's internal processing.
            </li>
          </ul>
        </>
      ),
    };

    return formulas;
  }

  if (node.node === "Append") {
    let formulas = {
      total_detail: (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              Run Cost: Since Append does not have a startup operation and
              immediately returns tuples from its children, the total cost is
              entirely composed of its run cost.
            </li>
          </ul>
        </>
      ),
    };

    if (node.parallel_aware === 0) {
      formulas.total = katex.renderToString(`\\text{Run Cost}`);
      formulas.total_cost = katex.renderToString(`= ${node.total_cost}`);
      formulas.run = katex.renderToString(
        `\\text{Subpath Cost} + \\text{CPU Cost per Tuple} \\times N_{\\text{rows}}`
      );
      formulas.run_cost = katex.renderToString(
        `= ${node.nonpartial_cost} + ${
          node.cpu_tuple_cost * node.multiplier
        } \\times ${node.rows} = ${node.total_cost}`
      );
      formulas.run_detail = (
        <>
          <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
            <li>
              Subpath Cost: Sum of the total costs of child paths (subplans),
              including sorting cost if applicable.
            </li>
            <li>
              CPU Cost per Tuple: Per-tuple overhead for passing each tuple
              through the Append node.
            </li>
            <li>
              N<sub>rows</sub>: Number of rows produced from all subpaths.
            </li>
          </ul>
        </>
      );

      return formulas;
    }

    formulas.total = katex.renderToString(`\\text{Run Cost}`);
    formulas.total_cost = katex.renderToString(`= ${node.total_cost}`);
    formulas.run = katex.renderToString(
      `\\text{Subpath Partial Cost} + \\text{Subpath Non-Partial Cost} + \\text{CPU Cost per Tuple} \\times N_{\\text{rows}}`
    );
    formulas.run_cost = katex.renderToString(
      `= ${node.partial_cost} + ${node.nonpartial_cost} + ${
        node.cpu_tuple_cost * node.multiplier
      } \\times ${node.rows} = ${node.total_cost}`
    );
    formulas.run_detail = (
      <>
        <ul className="list-disc list-outside ml-4 space-y-1 text-xs">
          <li>
            Subpath Partial Cost: Total cost from subpaths executed in parallel.
          </li>
          <li>
            Subpath Non-Partial Cost: Cost from remaining subpaths not run in
            parallel.
          </li>
          <li>
            CPU Cost per Tuple: Per-tuple overhead for passing each tuple
            through the Append node.
          </li>
          <li>
            N<sub>rows</sub>: Number of rows produced from all subpaths.
          </li>
        </ul>
      </>
    );

    return formulas;
  }
};
