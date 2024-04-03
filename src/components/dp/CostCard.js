import React, { useEffect, useState } from "react";
import { Card } from "@material-tailwind/react";
import Latex from 'react-latex';

const CostCard = props => {
    let node = props.node;
    const lines = node.split(" - ")
    node = lines[1]

    const [runCostFormula, setRunCostFormula] = useState('')
    const [startupCostFormula, setStartupCostFormula] = useState('')

    useEffect(() => {
        if(node === 'HashJoin'){
            setRunCostFormula('$O(N_{inner} + N_{outer})$')
            setStartupCostFormula('$O(N_{inner} + N_{outer})$')
        }
        else if(node === 'MergeJoin'){
            setRunCostFormula('$O(N_{inner} + N_{outer})$')
            setStartupCostFormula('$O(N_{outer}log_{2}(N_{outer}) + N_{inner}log_{2}(N_{inner}))$')
        }
        else if(node === 'NestLoop'){
            setRunCostFormula('$O(N_{inner} * N_{outer})$')
            setStartupCostFormula('$0$')
        }
    }
    , [node])

   
    
    
    return (
        <div>
            <Card>
                <div className='flex justify-between px-4 pt-2'>
                    <p className='vis-title pt-2'>Cost Card</p>
                </div>
    
                <div className='dp-cost-value flex-col items-center m-2 gap-2'>
                    <div>Total Cost:</div>
                    <div>{props.totalCost}</div>
                    <div> Startup Cost:</div>
                    <div>{props.startupCost}</div>
                    <div>Run Cost:</div>
                    <div>{(props.totalCost - props.startupCost).toFixed(2)}</div>
                    <div>Node:</div>
                    <div>{node}</div>
                    <div>{node} Run Cost Formula:</div>
                    <Latex>{runCostFormula}</Latex>
                    <div>{node} Startup Cost Formula:</div>
                    <Latex>{startupCostFormula}</Latex>
                </div>
            </Card>
        </div>
    )
};

export default CostCard;
