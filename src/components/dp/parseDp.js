/*
 * parseDp.js: 데이터 전처리
 */

export function parseDp(data) {
    const { optimizer } = data;
    const result = [];
    const uniqueNodeMap = new Map();

    // generate unique path node ids with numbering for duplicates
    const generateUniquePathNodeId = (baseId) => {
        if (!uniqueNodeMap.has(baseId)) {
            return baseId; // no need for numbering if baseId is not duplicated
        }
        let counter = 1; // start numbering from 1
        let newId = `${baseId} ${counter}`;
        // increment counter until a unique id is found
        while (uniqueNodeMap.has(newId)) {
            counter += 1;
            newId = `${baseId} ${counter}`;
        }
        return newId;
    };

    [...optimizer.base, ...optimizer.dp].forEach(entry => {
        if (!uniqueNodeMap.has(entry.relid)) {
            const newNode = { id: entry.relid, parentIds: [] };
            uniqueNodeMap.set(entry.relid, newNode);
            result.push(newNode);
        }

        if (entry.paths) {
            entry.paths.forEach(path => {
                let pathNodeId = `${entry.relid} - ${path.node}`;
                pathNodeId = generateUniquePathNodeId(pathNodeId);

                if (!uniqueNodeMap.has(pathNodeId)) {
                    const pathNode = { id: pathNodeId, parentIds: [] };
                    uniqueNodeMap.set(pathNodeId, pathNode);
                    result.push(pathNode);
                    uniqueNodeMap.get(entry.relid).parentIds.push(pathNodeId);
                }

                // process join information
                if (path.join) {
                    const processJoinSide = (side) => {
                        if (side && !uniqueNodeMap.has(side.relid)) {
                            const joinNode = { id: side.relid, parentIds: [] };
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
