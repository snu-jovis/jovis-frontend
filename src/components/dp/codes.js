if (level === 2) {
  if (node.join) {
    if (node.join.outer.sub || node.join.inner.sub) return;
    addNode(
      node.join.outer,
      0,
      `${node.join.outer.relid} - ${node.join.outer.node}`
    );
    addNode(
      node.join.outer,
      1,
      node.join.outer.relid,
      `${node.join.outer.relid} - ${node.join.outer.node}`
    );
    addNode(
      node.join.inner,
      0,
      `${node.join.inner.relid} - ${node.join.inner.node}`
    );
    addNode(
      node.join.inner,
      1,
      node.join.inner.relid,
      `${node.join.inner.relid} - ${node.join.inner.node}`
    );
  }
}
