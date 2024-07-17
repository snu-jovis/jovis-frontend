import { useState, useEffect } from "react";

import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

import imgSeqScan from "../../assets/img/seqscan.png";
import imgIdxScan from "../../assets/img/idxscan.png";
import imgBitmapHeapScan from "../../assets/img/bitmapheapscan.png";
import imgHashJoinBuild from "../../assets/img/hashjoin-build.png";
import imgHashJoinProbe from "../../assets/img/hashjoin-probe.png";
import imgMergeJoin from "../../assets/img/mergejoin.png";
import imgNestLoop from "../../assets/img/nestloop.png";

import "../../assets/stylesheets/Dp.css";

const DescriptionCard = ({ node }) => {
    const [nodeType, setNodeType] = useState("");
    const [description, setDescription] = useState("");

    const imageMap = {
        SeqScan: [imgSeqScan],
        IdxScan: [imgIdxScan],
        BitmapHeapScan: [imgBitmapHeapScan],
        HashJoin: [imgHashJoinBuild, imgHashJoinProbe],
        MergeJoin: [imgMergeJoin],
        NestLoop: [imgNestLoop],
        GatherMerge: [],
        Sort: [],
        Materialize: [],
        Gather: [],
        IncrementalSort: [],
        Aggregate: [],
        Append: [],
        Group: [],
    };

    const descriptionMap = {
        SeqScan: `A sequential scan reads the entire table sequentially.\nIt examines every row in the table, regardless of any indexes that might be present.\nThis method is straightforward but can be inefficient for large tables, as it does not utilize indexes to narrow down the search.\n`,
        IdxScan: `An index scan uses an index to find the rows that satisfy the condition. It scans the index to locate the rows of interest and then retrieves these rows from the table.\nThis method is efficient for large tables with selective conditions, as it avoids reading the entire table.\n`,
        BitmapHeapScan: `A bitmap heap scan reads pages in batches using a bitmap index.\nFirst, a bitmap index scan identifies the heap pages that contain the required rows.\nThen, the heap pages are read in batches, which reduces random I/O.\nThis method is useful for queries that return a large number of rows spread across many pages.\n`,
        HashJoin: `A hash join uses a hash table to find matching rows from both tables.\nThe in-memory hash join has two phases: the build and the probe phases. In the build phase, all tuples of the inner table are inserted into a batch; in the probe phase, each tuple of the outer table is compared with the inner tuples in the batch and joined if the join condition is satisfied.\n`,
        MergeJoin: `A merge join sorts both tables on the join keys and then merges them.\nIt requires both tables to be sorted, either through an explicit sort operation or by using pre-sorted data (e.g., from an index scan).\nThis method is efficient for large tables when both inputs are already sorted or can be sorted efficiently.\n`,
        NestLoop: `A nested loop join iterates over each row of one table (the outer table) and finds matching rows in the other table (the inner table).\nFor each row in the outer table, it scans the entire inner table to find matches.\nThis method is straightforward but can be inefficient for large tables, as it performs many scans of the inner table.\n`,
        GatherMerge: `A gater merge combines the output of child nodes, which are executed by parallel workers. Gather Merge consumes sorted data, and preserves this sort order.\n`,
        Sort: `Sorts rows into an order, usually as a result of an ORDER BY clause. Sorting lots of rows can be expensive in both time and memory. Your setting of work_mem determines how much memory is available to Postgres per sort. If a sort requires more memory than work_mem permits, it can be done in a slower way on disk. If the sort is by a single column, or multiple columns from the same table, you may be able to avoid it entirely by adding an index with the desired order.\n`,
        Materialize: `Stores the result of the child operation in memory, to allow fast, repeated access to it by parent operations. Your setting of work_mem determines how much memory is available to Postgres per materialize operation.\n`,
        Gather: `Gather combines the output of child nodes, which are executed by parallel workers. Gather does not make any guarantee about ordering, unlike Gather Merge, which preserves sort order.`,
        IncrementalSort: `Incremental sort is a database optimization feature, introduced in PostgreSQL 13, that allows sorting to be done incrementally during the query execution process. Sorting is a common operation in database queries, often necessary when retrieving data in a specific order. PostgreSQL’s query planner uses incremental sort to improve query performance, particularly for large datasets. This feature is enabled by default in PostgreSQL 13 and above.`,
        Aggregate: `Aggregate combines rows together to produce result(s). This can be a combination of GROUP BY, UNION or SELECT DISTINCT clauses, and/or functions like COUNT, MAX or SUM. Performing COUNT operations in Postgres can be quite slow relative to other databases, due to trade-offs with its data consistency method (MVCC). Where possible, estimating or pre-calculating the total number of rows is often much faster.`,
        Append: `Append combines the results of the child operations. This can be the result of an explicit UNION ALL statement, or the need for a parent operation to consume the results of two or more children together.`,
        Group: `Groups rows together for a GROUP BY operation.`,
    };

    useEffect(() => {
        if (node) {
            setNodeType(node.split(" - ")[1]);
            setDescription(descriptionMap[node.split(" - ")[1]] || "");
        }
    }, [node]);

    return (
        <div className='dp-cost-formula'>
            {node.length > 0 && nodeType in imageMap && imageMap[nodeType].length > 0 ? (
                imageMap[nodeType].map((imgSrc, index) => (
                    <div className='my-2' key={index}>
                        <CardMedia
                            key={index}
                            component='img'
                            image={imgSrc}
                            alt={nodeType}
                            className='image-resize dp-cost-formula'
                        />
                        {index === imageMap[nodeType].length - 1 && (
                            <CardContent>
                                <Typography gutterBottom variant='h5' component='div'>
                                    {nodeType}
                                </Typography>
                                <Typography variant='body2' component='p'>
                                    {description}
                                </Typography>
                            </CardContent>
                        )}
                    </div>
                ))
            ) : (
                <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                        {nodeType}
                    </Typography>
                    <Typography variant='body2' component='p'>
                        {description}
                    </Typography>
                </CardContent>
            )}
        </div>
    );
};

export default DescriptionCard;
