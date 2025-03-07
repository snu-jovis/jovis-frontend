/*
 * parseDp.js: preprocess data
 */
function countSubs(sub) {
  let count = 0;
  while (sub) {
    sub = sub.sub;
    count++;  }
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

function parseBase(base, nodeMap, printSub, appendChild, appendExist) {
  let level = appendExist ? 2 : 0;
  if (appendChild) level -= 2;

  base.forEach((relation) => {
    // add regular path
    relation.paths?.forEach((path) => {
      if (printSub) processSub(nodeMap, path, relation, level + 1, countSubs(path.sub));
      else {
        if (path.sub) return;

        addNode(nodeMap, path, level, getRelId(path));
        addNode(nodeMap, relation, level + 1, relation.relid, getRelId(path));
      }

      // add append path 
      // KOO-001: assume that append path is always in the base 
      relation.append?.forEach((append) => {
        parseBase([append], nodeMap, printSub, true, appendExist);

        // connect to the append node.
        // append path should have "Append" path name
        const pathRelid = `${relation.relid} - ` + path.node;
        addNode(nodeMap, append, 2, pathRelid, append.relid);
      });
    });
  });

  return appendExist;
}

export function parseDp(base, dp, nodeMap, printSub = true) {
  /* base 처리; access paths */

  // if there is any append node, levels zero and one are used by the append node,
  //   and the base node starts from level two.
  // Otherwise, the base node starts from level zero.
  const appendExist = base.some((relation) => relation.append);
  parseBase(base, nodeMap, printSub, false, appendExist);

  /* dp 처리 */
  dp.forEach((entry) => {
    let level = 0;
    // KOO-002: assume there is no aliased join
    if (entry.relid.includes("unnamed_join")) {
      level = (entry.relid.split(" ").length - 1) * 2 - 1;
    } else {
      level = entry.relid.split(" ").length * 2 - 1;
    }
    if (appendExist) level += 2;

    entry.paths?.forEach((path) => {
      if (path.join) {
        const pathRelid = `${entry.relid} - ${path.node}`;

        let innerRelid = path.join.inner.relid;
        const innerMatch = innerRelid.match(/^(.+?)\) required_outer \(/);
        if (innerMatch) innerRelid = innerMatch[1];

        let outerRelid = path.join.outer.relid;
        const outerMatch = outerRelid.match(/^(.+?)\) required_outer \(/);
        if (outerMatch) outerRelid = outerMatch[1];

        addNode(nodeMap, path, level - 1, pathRelid);
        addNode(nodeMap, entry, level, entry.relid, pathRelid);

        addNode(nodeMap, path, level, pathRelid, innerRelid);
        addNode(nodeMap, path, level, pathRelid, outerRelid);
      }

      if (printSub && path.sub)
        processSub(nodeMap, path, entry, level, countSubs(path.sub));
    });
  });

  return Array.from(nodeMap.values()).map((node) => ({
    ...node,
  }));
}
