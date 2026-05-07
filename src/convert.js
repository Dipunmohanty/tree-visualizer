import React from "react";

export function convertToFlow(
  node,
  onAddChild,
  toggleCollapse,
  renameNode
) {
  let nodes = [];
  let edges = [];

  function traverse(currentNode) {
    currentNode.toggleCollapse =
      toggleCollapse;

    currentNode.renameNode =
      renameNode;

    nodes.push({
      id: currentNode.id,

      position: {
        x: currentNode.x,
        y: currentNode.y
      },

      sourcePosition: "bottom",
      targetPosition: "top",

      data: {
        searchLabel:
          currentNode.name ||
          currentNode.id,

        label: (
          <div
            style={{
              position: "relative",

              width: "140px",
              padding: "0 24px",
              height: "90px",

              background:
                currentNode.highlighted
                  ? "#2563eb"
                  : "#17243b",

              borderRadius: "18px",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              color: "white",

              boxShadow:
                currentNode.highlighted
                  ? "0 0 25px rgba(37,99,235,0.8)"
                  : "0 6px 18px rgba(0,0,0,0.2)",

              transition:
                "all 0.2s ease"
            }}
          >
            {/* Node Content */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px"
              }}
            >
              {/* Title */}
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "bold"
                }}
              >
                {currentNode.name ||
                  currentNode.id}
              </div>

              {/* Metadata */}
              <div
                style={{
                  fontSize: "11px",
                  opacity: 0.8,
                  fontWeight: "normal",
                  lineHeight: "1.3",
                  textAlign: "center"
                }}
              >
                Children:{" "}
                {currentNode.children
                  ? currentNode.children
                      .length
                  : 0}

                <br />

                Status:{" "}
                {currentNode.collapsed
                  ? "Collapsed"
                  : "Open"}
              </div>
            </div>

            {/* Rename Button */}
            <button
              onClick={e => {
                e.stopPropagation();

                currentNode.renameNode(
                  currentNode.id
                );
              }}

              style={{
                position: "absolute",

                left: "-18px",

                top: "50%",

                transform:
                  "translateY(-50%)",

                width: "32px",

                height: "32px",

                borderRadius: "50%",

                border: "none",

                background: "#0ea5e9",

                color: "white",

                fontSize: "18px",

                cursor: "pointer",

                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.2)"
              }}
            >
              ✏️
            </button>

            {/* Collapse Button */}
            <button
              onClick={e => {
                e.stopPropagation();

                currentNode.toggleCollapse(
                  currentNode.id
                );
              }}

              style={{
                position: "absolute",

                right: "-18px",

                top: "50%",

                transform:
                  "translateY(-50%)",

                width: "32px",

                height: "32px",

                borderRadius: "50%",

                border: "none",

                background: "#475569",

                color: "white",

                fontSize: "18px",

                cursor: "pointer",

                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.2)"
              }}
            >
              {currentNode.collapsed
                ? "↑"
                : "↓"}
            </button>

            {/* Add Button */}
            <button
              onClick={e => {
                e.stopPropagation();

                onAddChild(
                  currentNode.id
                );
              }}

              style={{
                position: "absolute",

                bottom: "-26px",

                left: "50%",

                transform:
                  "translateX(-50%)",

                width: "38px",

                height: "38px",

                borderRadius: "50%",

                border: "none",

                background: "#22c55e",

                color: "white",

                fontSize: "28px",

                fontWeight: "bold",

                cursor: "pointer",

                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.2)"
              }}
            >
              +
            </button>
          </div>
        )
      },

      style: {
        background: "transparent",
        border: "none",
        width: 140,
        height: 90
      }
    });

    if (
      currentNode.children &&
      !currentNode.collapsed
    ) {
      currentNode.children.forEach(
        child => {
          edges.push({
            id: `${currentNode.id}-${child.id}`,

            source: currentNode.id,

            target: child.id,

            type: "smoothstep"
          });

          traverse(child);
        }
      );
    }
  }

  traverse(node);

  return { nodes, edges };
}