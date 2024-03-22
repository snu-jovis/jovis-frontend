/*
 * parseDp.js: 데이터 전처리
 */


export function parseDp(data) {
    const { optimizer } = data;
    const result = [];

    // Unique ID map to track nodes
    const uniqueNodeMap = new Map();

    // Process base and dp entries
    [...optimizer.base, ...optimizer.dp].forEach(entry => {
        // Ensure each entry is unique
        if (!uniqueNodeMap.has(entry.relid)) {
            const newNode = {
                id: entry.relid,
                parentIds: [],
            };
            uniqueNodeMap.set(entry.relid, newNode);
            result.push(newNode);
        }

        // additional handling for dp paths
        if (entry.paths) {
            entry.paths.forEach(path => {
                // define a unique ID for the path node
                const pathNodeId = `${entry.relid} - ${path.node}`;
                if (!uniqueNodeMap.has(pathNodeId)) {
                    // Create a new node for the path
                    const pathNode = {
                        id: pathNodeId,
                        parentIds: [],
                    };
                    uniqueNodeMap.set(pathNodeId, pathNode);
                    result.push(pathNode);
                    // Link the path node to its dpEntry parent
                    uniqueNodeMap.get(entry.relid).parentIds.push(pathNodeId);
                }

                // process join information
                if (path.join) {
                    const processJoinSide = (side) => {
                        if (side && !uniqueNodeMap.has(side.relid)) {
                            const joinNode = {
                                id: side.relid,
                                parentIds: [],
                            };
                            uniqueNodeMap.set(side.relid, joinNode);
                            result.push(joinNode);
                        }
                        if (side) {
                            uniqueNodeMap.get(pathNodeId).parentIds.push(side.relid);
                        }
                    };

                    processJoinSide(path.join.outer);
                    processJoinSide(path.join.inner);
                }
            });
        }
    });

    return result;
}
