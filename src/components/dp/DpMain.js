import React, { useEffect, useState, useRef } from 'react';
import GraphView from './GraphView';
import CostCard from './CostCard';
import data from '../../data/dp.json';
import { Card } from '@material-tailwind/react';

import '../../assets/stylesheets/Dp.css';

const DpMain = props => {
    const viewRef = useRef(null);
    const [viewSize, setViewSize] = useState([0, 0]);

    useEffect(() => {
        const updateSize = () => {
            setViewSize([viewRef.current.offsetWidth, viewRef.current.offsetHeight]);
        };

        // initial size
        updateSize();

        // update sizes on resize
        window.addEventListener('resize', updateSize);

        // cleanup
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return (
        <div>
            <div ref={viewRef} className='w-fuvll place-content-center'>
                <Card>
                    <GraphView width={viewSize[0] ? viewSize[0] - 20 : 500} height={500} data={data} />
                </Card>
            </div>
        </div>
    );
};

export default DpMain;
