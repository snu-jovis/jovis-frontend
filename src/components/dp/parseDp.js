/*
 * parseDp.js: 데이터 전처리
 */

export function parseDp(data) {
    const { optimizer } = data;
    const result = [];
  
    // Process base entries as before
    optimizer.base.forEach(baseEntry => {
        result.push({
            id: baseEntry.relid,
            parentIds: [],
        });
    });
  
    // A map to track unique nodes and prevent duplication
    const uniqueNodeMap = new Map();
  
    // Process dp entries
    optimizer.dp.forEach(dpEntry => {
        // Prepare the dpEntry itself
        const dpEntryNode = {
            id: dpEntry.relid,
            parentIds: new Set(), // Use a Set to avoid duplicate parent IDs
        };
  
        // Ensure dpEntry is unique and add to results
        if (!uniqueNodeMap.has(dpEntry.relid)) {
            uniqueNodeMap.set(dpEntry.relid, dpEntryNode);
            result.push(dpEntryNode);
        }
  
        // Process each path
        dpEntry.paths.forEach(path => {
            const pathNodeId = `${dpEntry.relid} - ${path.node}`;
            if (!uniqueNodeMap.has(pathNodeId)) {
                // New node for the path
                const pathNode = {
                    id: pathNodeId,
                    parentIds: new Set(),
                };
                uniqueNodeMap.set(pathNodeId, pathNode);
                result.push(pathNode);
            }
  
            // Link pathNode to dpEntry
            dpEntryNode.parentIds.add(pathNodeId);
  
            // Handle joins
            if (path.join) {
                const { outer, inner } = path.join;
                [outer?.relid, inner?.relid].forEach(relid => {
                    if (relid) {
                        uniqueNodeMap.get(pathNodeId).parentIds.add(relid);
                    }
                });
            }
        });
    });
  
    // Convert parentIds from Set to Array and finalize the result
    return result.map(node => ({
        ...node,
        parentIds: Array.from(node.parentIds),
    }));
}
