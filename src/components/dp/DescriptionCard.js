import { useState, useEffect } from "react";
import imgSeqScan from "../../assets/img/seqscan.png";
import imgIdxScan from "../../assets/img/idxscan.png";
import imgBitmapHeapScan from "../../assets/img/bitmapheapscan.png";
import imgHashJoinBuild from "../../assets/img/hashjoin-build.png";
import imgHashJoinProbe from "../../assets/img/hashjoin-probe.png";
import imgMergeJoin from "../../assets/img/mergejoin.png";
import imgNestLoop from "../../assets/img/nestloop.png";
import "../../assets/stylesheets/Dp.css";

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
        SeqScan: "A sequential scan reads the entire table sequentially.",
        IdxScan: "An index scan uses an index to find the rows that satisfy the condition.",
        BitmapHeapScan: "A bitmap heap scan reads pages in batches using a bitmap index.",
        HashJoin: "A hash join uses a hash table to find matching rows from both tables.",
        MergeJoin: "A merge join sorts both tables and then merges them.",
        NestLoop: "A nested loop join iterates over each row of one table and finds matching rows in the other table.",
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
                            <div key={index}>
                                <img src={imgSrc} alt={node} className='image-resize' />
                                <br />
                                <br />
                                {index === imageMap[node].length - 1 && <p>{description}</p>}
                            </div>
                        ))}
                </div>
            )}
        </>
    );
};

export default DescriptionCard;
