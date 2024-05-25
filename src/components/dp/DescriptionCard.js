import { useState, useEffect } from "react";

import Card from "@mui/material/Card";
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
import styles from "./styles";

const DescriptionCard = props => {
    const [node, setNode] = useState("");
    const [description, setDescription] = useState("");

    const imageMap = {
        SeqScan: [imgSeqScan],
        IdxScan: [imgIdxScan],
        BitmapHeapScan: [imgBitmapHeapScan],
        HashJoin: [imgHashJoinBuild, imgHashJoinProbe],
        MergeJoin: [imgMergeJoin],
        NestLoop: [imgNestLoop],
    };

    const descriptionMap = {
        SeqScan: `A sequential scan reads the entire table sequentially.\nIt examines every row in the table, regardless of any indexes that might be present.\nThis method is straightforward but can be inefficient for large tables, as it does not utilize indexes to narrow down the search.\n`,

        IdxScan: `An index scan uses an index to find the rows that satisfy the condition. It scans the index to locate the rows of interest and then retrieves these rows from the table.\nThis method is efficient for large tables with selective conditions, as it avoids reading the entire table.\n`,

        BitmapHeapScan: `A bitmap heap scan reads pages in batches using a bitmap index.\nFirst, a bitmap index scan identifies the heap pages that contain the required rows.\nThen, the heap pages are read in batches, which reduces random I/O.\nThis method is useful for queries that return a large number of rows spread across many pages.\n`,

        HashJoin: `A hash join uses a hash table to find matching rows from both tables.\nThe in-memory hash join has two phases: the build and the probe phases. In the build phase, all tuples of the inner table are inserted into a batch; in the probe phase, each tuple of the outer table is compared with the inner tuples in the batch and joined if the join condition is satisfied.\n`,

        MergeJoin: `A merge join sorts both tables on the join keys and then merges them.\nIt requires both tables to be sorted, either through an explicit sort operation or by using pre-sorted data (e.g., from an index scan).\nThis method is efficient for large tables when both inputs are already sorted or can be sorted efficiently.\n`,

        NestLoop: `A nested loop join iterates over each row of one table (the outer table) and finds matching rows in the other table (the inner table).\nFor each row in the outer table, it scans the entire inner table to find matches.\nThis method is straightforward but can be inefficient for large tables, as it performs many scans of the inner table.\n`,
    };

    useEffect(() => {
        if (props.showJoinCard && props.node) {
            const nodeType = props.node.split(" - ")[1];
            setNode(nodeType);
            setDescription(descriptionMap[nodeType] || "");
        }
    }, [props.showJoinCard, props.node]);

    return (
        <>
            {props.showJoinCard && (
                <div className='dp-cost-formula'>
                    {props.node.length > 0 &&
                        node in imageMap &&
                        imageMap[node].map((imgSrc, index) => (
                            <div className='my-2' key={index}>
                                <CardMedia
                                    key={index}
                                    component='img'
                                    image={imgSrc}
                                    alt={node}
                                    className='image-resize dp-cost-formula'
                                />
                                {index === imageMap[node].length - 1 && (
                                    <CardContent>
                                        <Typography style={styles.valueFont} gutterBottom variant='h5' component='div'>
                                            {node}
                                        </Typography>
                                        <Typography
                                            styles={styles.bodyFont}
                                            variant='body2'
                                            color='textSecondary'
                                            component='p'
                                        >
                                            {description}
                                        </Typography>
                                    </CardContent>
                                )}
                            </div>
                        ))}
                </div>
            )}
        </>
    );
};

export default DescriptionCard;
