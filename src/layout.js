const NODE_WIDTH = 320;
const LEVEL_HEIGHT = 220;

export function layoutTree(root) {
  function calculateSubtreeWidth(node) {
    if (
      node.collapsed ||
      !node.children ||
      node.children.length === 0
    ) {
      node.subtreeWidth = NODE_WIDTH;
      return NODE_WIDTH;
    }

    let totalWidth = 0;

    node.children.forEach(child => {
      totalWidth +=
        calculateSubtreeWidth(child);
    });

    node.subtreeWidth = Math.max(
      totalWidth,
      NODE_WIDTH
    );

    return node.subtreeWidth;
  }

  function assignPositions(
    node,
    left,
    depth
  ) {
    node.x =
        left +
        node.subtreeWidth / 2 -
        70;

    node.y = depth * LEVEL_HEIGHT;

    if (
      node.collapsed ||
      !node.children
    ) {
      return;
    }

    let currentLeft = left;

    node.children.forEach(child => {
      assignPositions(
        child,
        currentLeft,
        depth + 1
      );

      currentLeft +=
        child.subtreeWidth;
    });
  }

  calculateSubtreeWidth(root);

  assignPositions(root, 0, 0);

  return root;
}