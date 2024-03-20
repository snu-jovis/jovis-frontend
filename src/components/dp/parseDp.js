/*
 * parseDp.js: 데이터 전처리
 */


// const data = [
//   {
//     id: "a",
//     parentIds: []
//   },
//   {
//     id: "b",
//     parentIds: []
//   },
//   {
//     id: "c",
//     parentIds: []
//   },
//   {
//     id: "d",
//     parentIds: []
//   },
//   {
//     id: "a b",
//     parentIds: ["a", "b"]
//   },
//   {
//     id: "a c",
//     parentIds: ["a", "c"]
//   },
//   {
//     id: "a d",
//     parentIds: ["a", "d"]
//   },
//   {
//     id: "b c",
//     parentIds: ["b", "c"]
//   },
//   {
//     id: "b d",
//     parentIds: ["b", "d"]
//   },
//   {
//     id: "c d",
//     parentIds: ["c", "d"]
//   },
//   {
//     id: "a b c",
//     parentIds: ["b c", "a c", "a b"]
//   },
//   {
//     id: "a b d",
//     parentIds: ["a b", "a d", "b d"]
//   },
//   {
//     id: "a c d",
//     parentIds: ["c d", "a c", "c d"]
//   },
//   {
//     id: "b c d",
//     parentIds: ["b c", "c d", "b d"]
//   },
//   {
//     id: "a b c d",
//     parentIds: ["b c d", "a c d", "a b", "c d", ]
//   }
// ];
    

export function parseDp(data) {
  const optimizerData = data.optimizer;
  const result = [];

  // Step 1: Process base entries
  optimizerData.base.forEach(baseEntry => {
      result.push({
          id: baseEntry.relid,
          parentIds: []
      });
  });

  // Step 2 & 3: Process dp entries
  optimizerData.dp.forEach(dpEntry => {
      // Directly add dp entry with empty parentIds for now
      result.push({
          id: dpEntry.relid,
          parentIds: [] // To be populated next
      });

      dpEntry.paths.forEach(path => {
          // Handle joins if any
          if (path.join) {
              let outerRelid = path.join.outer?.relid;
              let innerRelid = path.join.inner?.relid;

              // Find or create parent entries for outer and inner joins
              [outerRelid, innerRelid].forEach(relid => {
                  if (relid) {
                      // Find existing or add new parentId
                      let parentIdEntry = result.find(entry => entry.id === relid);
                      if (!parentIdEntry) {
                          parentIdEntry = { id: relid, parentIds: [] };
                          result.push(parentIdEntry);
                      }
                      // Add to parentIds of current path's entry if not already included
                      const currentEntry = result.find(entry => entry.id === dpEntry.relid);
                      if (!currentEntry.parentIds.includes(parentIdEntry.id)) {
                          currentEntry.parentIds.push(parentIdEntry.id);
                      }
                  }
              });
          }
      });
  });

  return result;
}
