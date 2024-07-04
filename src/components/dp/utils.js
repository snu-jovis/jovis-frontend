/*
 * utils.js: Contains utility functions for the Dynamic Programming component.
 */

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

export const generateFormulas = props => {
    return {
        HashJoin: {
            run: `Outer Run Cost + Hash Table Probe CPU Cost + Disk Page Read/Write Cost (if batching) + Hash Join Qualification CPU Cost + Hash Join CPU Cost`,
            runValue: `= ${props.outerPathTotal - props.outerPathStartup} + ${
                0.0025 * props.numHashClauses * props.outerPathRows
            }  + (1.0 * (${props.innerPages} + 2 * ${props.outerPages})) + ${props.hashQualEvalCost} + ${
                props.hashJoinTuples * props.cpuPerTuple
            }`,
            startup: `Inner Total Cost + Outer Startup Cost + Hash Table Build CPU Cost + Disk Page Read Cost (if batching)`,
            startupValue: `= ${props.innerPathTotal} + ${props.outerPathStartup} + ${props.hashCpuCost} + (1.0 * ${props.innerPages})`,
        },
        MergeJoin: {
            run: `Outer Join CPU Cost + Merge Join Evaluation CPU Cost + Inner Rescan Cost + Merge Join CPu Cost`,
            runValue: `= ${props.outerRunCost} + ${props.mergeEvalCost} + ${
                props.bareInnerCost + props.matInnerCost
            } + ${props.mergeJoinTuples * 0.01}`,
            startup: `(Inner Sort Cost + Outer Sort Cost) + (Inner Initial Scan Cost + Outer Initial Scan Cost) + Merge Join Initial Evaluation CPU Cost`,
            startupValue: `= (${props.innerPathStartup} + ${props.outerPathStartup}) + (${props.innerScanCost} + ${props.outerScanCost}) + ${props.mergeInitialEvalCost}`,
        },
        NestLoop: {
            run: `Outer Run Cost + Inner Run Cost + (Outer Rows * Inner Rescan Start Cost) + (Outer Rows * Inner Rescan Run Cost) + (Outer Matched Tuple Cost + Outer Unmatched Tuple Cost) + Inner Scan Cost + Nested Loop Join CPU Cost`,
            runValue: `= ${props.outerRunCost} + ${props.innerRunCost} + (${props.outerPathRows} * ${
                props.innerRescanStartupCost
            }) + (${props.outerPathRows} * ${props.innerRescanRunCost}) + (${props.matchedOuterTupleCost} + ${
                props.unmatchedOuterTupleCost
            }) + ${props.innerScanCost} + ${props.tuples * 0.01}`,
            startup: `Outer Startup Cost + Inner Startup Cost`,
            startupValue: `= ${props.outerStartupCost} + ${props.innerStartupCost}`,
        },
        SeqScan: {
            run: `CPU Run Cost + Disk Run Cost`,
            runValue: `= ${props.cpuRunCost} + ${props.pages}`,
            startup: "0",
        },
        IdxScan: {
            run: `Index CPU & IO Cost + Table CPU Cost + Table IO Cost`,
            runValue: `= ${props.indexTotalCost - props.indexStartupCost} + ${props.cpuRunCost} + (${
                props.maxIOCost
            } + ${props.csquared} * (${props.maxIOCost} - ${props.minIOCost}))`,
            startup: `Index Startup Cost`,
            startupValue: `= ${props.indexStartupCost}`,
            selectivity: `${props.selectivity}`,
        },
        BitmapHeapScan: {
            run: `CPU Run Cost + Disk Run Cost`,
            runValue: `= ${props.cpuRunCost} + ${props.pages}`,
            startup: `Index Total Cost`,
            startupValue: `= ${props.indexTotalCost}`,
        },
    };
};
