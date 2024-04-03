import { Card } from '@material-tailwind/react';
import Latex from 'react-latex';

const JoinOrderCard = props => {
    const joinOrderParts = props.joinOrder.split(',');
    let joinOrderArray = [];
    for (let i = 0; i < joinOrderParts.length; i += 2) {
        let joinOrderText = joinOrderParts[i] + ' \\bowtie ' + (joinOrderParts[i + 1] || '');
        joinOrderArray.push(joinOrderText);
    }

    return (
        <div>
            <Card>
                <div className='flex justify-between px-4 pt-2'>
                    <p className='vis-title pt-2'>Join Order Card</p>
                </div>

                <div className='dp-cost-value flex-col items-center m-2 gap-2'>
                    <div>Node:</div>
                    <div>{props.node}</div>
                    <div>Join Order:</div>
                    <Latex>{`$${joinOrderArray}$`}</Latex>
                </div>
            </Card>
        </div>
    );
};

export default JoinOrderCard;
