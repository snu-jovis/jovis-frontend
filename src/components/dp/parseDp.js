/*
 * parseDp.js: 데이터 전처리
 */

export function parseDp(data) {
    const { optimizer } = data;
    const result = [];
    const uniqueNodeMap = new Map();

    const generateUniquePathNodeId = (baseId) => {
        let counter = 1;
        let newId = `${baseId} ${counter}`;
        while (uniqueNodeMap.has(newId)) {
            counter++;
            newId = `${baseId} ${counter}`;
        }
        return newId;
    };

    const addNodeIfNotExist = (nodeId) => {
        if (!uniqueNodeMap.has(nodeId)) {
            uniqueNodeMap.set(nodeId, { id: nodeId, parentIds: [], labels: [] });
        }
    };

    const addLabel = (pathNodeId, label) => {
        uniqueNodeMap.get(pathNodeId).labels.push(label);
    };

    [...optimizer.base, ...optimizer.dp].forEach(entry => {
        addNodeIfNotExist(entry.relid);

        entry.paths?.forEach(path => {
            let pathNodeId = generateUniquePathNodeId(`${entry.relid} - ${path.node}`);
            addNodeIfNotExist(pathNodeId);

            uniqueNodeMap.get(entry.relid).parentIds.push(pathNodeId);
            
            if(path.join){
            const processJoinSide = (side, sideType) => {
                if (side) {
                    addNodeIfNotExist(side.relid);
                    uniqueNodeMap.get(pathNodeId).parentIds.push(side.relid);
                    // check for Material or Memoize nodes and add labels
                    if (side.node === "Material" || side.node === "Memoize") {
                        addLabel(pathNodeId, `${side.node}`);
                    }
                    if (side.sub) {
                        processJoinSide(side.sub, sideType);
                    }
                }
            };

            processJoinSide(path.join.outer, "outer");
            processJoinSide(path.join.inner, "inner");
            }
        });
    });

    return Array.from(uniqueNodeMap.values()).map(node => ({
        id: node.id,
        parentIds: node.parentIds,
        // only include labels if they exist
        ...(node.labels.length > 0 && { labels: node.labels })
    }));
}
