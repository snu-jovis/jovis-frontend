/*
 * parseDp.js: 데이터 전처리
 */

export function parseDp(data) {
    const { optimizer } = data;
    const nodeMap = new Map();

    // path node 동일한 경우 처리
    const generateId = baseId => {
        let counter = 1;
        let newId = `${baseId} ${counter}`;
        while (nodeMap.has(newId)) {
            counter++;
            newId = `${baseId} ${counter}`;
        }
        return newId;
    };

    // id, parentIds 만들기
    const addNode = (relid, parentRelid = null) => {
        if (!nodeMap.has(relid)) {
            nodeMap.set(relid, { id: relid, parentIds: [] });
        }
        if (parentRelid && !nodeMap.get(relid).parentIds.includes(parentRelid)) {
            nodeMap.get(relid).parentIds.push(parentRelid);
        }
    };

    // Material/Memoize 처리
    const addSpecialNode = (pathNode, relid, parentRelid) => {
        const specialRelid = `${relid} - ${pathNode}`;
        addNode(specialRelid);
        addNode(specialRelid, relid);
        addNode(parentRelid, specialRelid);
    };

    [...optimizer.base, ...optimizer.dp].forEach(entry => {
        addNode(entry.relid);

        entry.paths?.forEach(path => {
            // path node
            let pathRelid = generateId(`${entry.relid} - ${path.node}`);
            addNode(pathRelid);
            addNode(entry.relid, pathRelid);

            if (path.join) {
                const processJoin = side => {
                    if (side) {
                        if (side.node === 'Material' || side.node === 'Memoize') {
                            addSpecialNode(side.node, side.relid, pathRelid);
                        } else {
                            addNode(pathRelid, side.relid);
                        }
                    }
                };

                processJoin(path.join.outer, 'outer');
                processJoin(path.join.inner, 'inner');
            }
        });
    });

    return Array.from(nodeMap.values()).map(node => ({
        id: node.id,
        parentIds: node.parentIds,
    }));
}

export function parseOptimalOne(data) {
    const { optimizer } = data;
    const nodeMap = new Map();

    const addNode = (id, parentId) => {
        let node;
        if (nodeMap.has(id)) {
            node = nodeMap.get(id);
        } else {
            node = { id: id, parentIds: [] };
            nodeMap.set(id, node);
        }
        if (parentId && !node.parentIds.includes(parentId)) {
            if (id !== parentId) {
                node.parentIds.push(parentId);
            }
        }
    };

    [...optimizer.base, ...optimizer.dp].forEach(entry => {
        if (entry.cheapest_total_paths) {
            const node = entry.cheapest_total_paths;
            const nodeId = `${entry.relid} - ${node.node}`;
            const parentId = entry.relid;

            addNode(nodeId, null);
            addNode(parentId, nodeId);
            if (node.join) {
                const processJoin = side => {
                    if (side) {
                        addNode(nodeId, side.relid);
                    }
                };

                processJoin(node.join.outer, 'outer');
                processJoin(node.join.inner, 'inner');
            }
        }
    });

    return Array.from(nodeMap.values());
}
