export const extractNodeType = node => node.split(" - ")[1];

export const formatJoinOrder = joinOrder => {
    if (joinOrder.length === 0) return [];
    const joinOrderParts = joinOrder.split(",");

    if (joinOrderParts.length <= 2) {
        return joinOrderParts.reduce((acc, part, i, arr) => {
            const formattedPart = part.trim().replace(/\s+/g, " \\bowtie ");
            return acc + `${formattedPart}` + (i + 1 < arr.length ? " \\bowtie " : "");
        }, "");
    } else {
        const groupedParts = [];
        for (let i = 0; i < joinOrderParts.length; i += 2) {
            if (i + 1 < joinOrderParts.length) {
                groupedParts.push(
                    `\\rm{(${joinOrderParts[i].replace(/\s+/g, " \\bowtie ")})} \\bowtie ${joinOrderParts[
                        i + 1
                    ].replace(/\s+/g, " \\bowtie ")}`
                );
            } else {
                groupedParts.push(`\\rm{(${joinOrderParts[i].replace(/\s+/g, " \\bowtie ")})}`);
            }
        }
        return groupedParts;
    }
};

export const formatNumber = num => num.toLocaleString();

export const generateFormulas = props => {
    return {
        HashJoin: {
            run: `Outer Path Run Cost + Hash Table Probe CPU Cost + Disk Page Read/Write Cost (if batching)`,
            runValue: `= ${formatNumber(props.outerPathTotal - props.outerPathStartup)} + (0.01 * ${formatNumber(
                props.numHashClauses
            )} * ${formatNumber(props.outerPathRows)}) + (1.0 * (${formatNumber(props.innerPages)} + 2 * ${formatNumber(
                props.outerPages
            )}))`,
            startup: `Inner Path Total Cost + Outer Path Startup Cost + Hash Table Build CPU Cost + Disk Page Read Cost (if batching)`,
            startupValue: `= ${formatNumber(props.innerPathTotal + props.outerPathStartup)} + ${
                (0.0125 * formatNumber(props.numHashClauses) + 1.0) * formatNumber(props.innerPathRows)
            } + (1.0 * ${formatNumber(props.innerPages)})`,
        },
        MergeJoin: {
            run: `Outer Path Join CPU Cost + Inner Path Join CPU Cost`,
            runValue: `= ${formatNumber(props.initialRunCost)} + ${formatNumber(props.innerRunCost)}`,
            startup: `(Outer Path Sort Cost + Inner Path Sort Cost) + (Outer Path Initial Scan Cost + Inner Path Initial Scan Cost)`,
            startupValue: `= (${formatNumber(props.innerStartupCost)} + ${formatNumber(
                props.outerStartupCost
            )}) + (${formatNumber(props.innerScanCost)} + ${formatNumber(props.outerScanCost)})`,
        },
        NestLoop: {
            run: `Outer Path Run Cost + Inner Path Run Cost + (N_outerpathrows - 1) * Inner Rescan Start Cost + (N_outerpathrows - 1) * Inner Rescan Run Cost`,
            runValue: `= ${formatNumber(props.outerRunCost)} + ${formatNumber(props.innerRunCost)} + ${formatNumber(
                props.outerPathRows
            )} * ${formatNumber(props.innerRescanStartupCost)} + ${formatNumber(props.outerPathRows)} * ${formatNumber(
                props.innerRescanRunCost
            )}`,
            startup: `Outer Path Startup Cost + Inner Path Startup Cost`,
            startupValue: `= ${formatNumber(props.outerStartupCost)} + ${formatNumber(props.innerStartupCost)}`,
        },
        SeqScan: {
            run: `(CPU cost per tuple * # of tuples) + (Disk cost per page * # of pages)`,
            runValue: `= (${formatNumber(props.cpuPerTuple)} * ${formatNumber(props.tuples)}) + (1.0 * ${formatNumber(
                props.pages
            )})`,
            startup: "0",
        },
        IdxScan: {
            run: `Index CPU & IO Cost + Table CPU Cost + Table IO Cost`,
            runValue: `= ${formatNumber(props.indexTotalCost - props.indexStartupCost)} + ${formatNumber(
                props.cpuRunCost
            )} + (${props.maxIOCost} + ${props.csquared} * (${props.maxIOCost} - ${props.minIOCost}))`,
            startup: `Index Startup Cost`,
            startupValue: `= ${formatNumber(props.indexStartupCost)}`,
            selectivity: `${props.selectivity}`,
        },
        BitmapHeapScan: {
            run: `(CPU cost per tuple * # of tuples) + (Disk cost per page * # of pages)`,
            runValue: `= (${formatNumber(props.cpuPerTuple)} * ${formatNumber(props.tuples)}) + (${formatNumber(
                props.costPerPage
            )} * ${formatNumber(props.pages)})`,
            startup: `Index Total Cost`,
            startupValue: `= ${formatNumber(props.indexTotalCost)}`,
        },
    };
};
