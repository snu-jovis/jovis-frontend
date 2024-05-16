/*
 * parseDp.js: 데이터 전처리
 */
function countSubs(sub) {
  let count = 0;
  while (sub) {
    sub = sub.sub;
    count++;
  }
  return count;
}

function getRelId(path) {
  return `${path.relid} - ${path.node}`;
}

function addNode(nodeMap, node, level, relid, parentRelid = null) {
  if (!nodeMap.has(relid)) {
    nodeMap.set(relid, {
      id: relid,
      parentIds: [],
      children: [],
      level,
      nodeData: node,
    });
  }

  if (parentRelid) {
    if (!nodeMap.get(relid).parentIds.includes(parentRelid)) {
      nodeMap.get(relid).parentIds.push(parentRelid);
    }
    if (!nodeMap.get(parentRelid).children.includes(relid)) {
      nodeMap.get(parentRelid).children.push(relid);
    }
  }
}

function processSub(nodeMap, path, entry, level, numSubs) {
  let currPath = path;
  let currEntry = entry;
  let newLevel = level;

  for (let i = numSubs; i >= 0; i--) {
    const relId = getRelId(currPath);

    addNode(nodeMap, currPath, newLevel - 1 / (numSubs + 1), relId);
    addNode(
      nodeMap,
      currEntry,
      newLevel,
      currEntry.node ? getRelId(currEntry) : currEntry.relid,
      relId
    );

    currEntry = currPath;
    currPath = currPath.sub;
    newLevel = newLevel - 1 / (numSubs + 1);
  }
}

export function parseDp(base, dp, nodeMap, printSub = false) {
  /* base 처리; access paths */
  base.forEach((relation) => {
    relation.paths?.forEach((path) => {
      if (printSub) processSub(nodeMap, path, relation, 1, countSubs(path.sub));
      else {
        if (path.sub) return;

        addNode(nodeMap, path, 0, getRelId(path));
        addNode(nodeMap, relation, 1, relation.relid, getRelId(path));
      }
    });
  });

  /* dp 처리 */
  dp.forEach((entry) => {
    const level = entry.relid.split(" ").length;

    entry.paths?.forEach((path) => {
      if (path.join) {
        const pathRelid = `${entry.relid} - ${path.node}`;

        addNode(nodeMap, path, 2 * level - 2, pathRelid);
        addNode(nodeMap, entry, 2 * level - 1, entry.relid, pathRelid);

        addNode(nodeMap, path, level, pathRelid, path.join.outer.relid);
        addNode(nodeMap, path, level, pathRelid, path.join.inner.relid);
      }

      if (printSub && path.sub)
        processSub(nodeMap, path, entry, 2 * level - 1, countSubs(path.sub));
    });
  });

  return Array.from(nodeMap.values()).map((node) => ({
    ...node,
  }));
}
