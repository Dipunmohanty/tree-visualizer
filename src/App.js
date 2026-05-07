import React, {
  useState,
  useEffect
} from "react";

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useReactFlow
} from "reactflow";

import "reactflow/dist/style.css";

import { tree } from "./treeData";
import { layoutTree } from "./layout";
import { convertToFlow } from "./convert";

function CenterButton() {
  const { fitView } = useReactFlow();

  return (
    <button
      onClick={() =>
        fitView({
          padding: 0.2,
          duration: 800
        })
      }
      style={{
        position: "absolute",
        top: 20,
        right: 20,
        zIndex: 10,
        padding: "10px 16px",
        border: "none",
        borderRadius: "8px",
        background: "#0f172a",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      Center Tree
    </button>
  );
}

function SearchFocus({
  searchTerm,
  nodes
}) {
  const { setCenter } =
    useReactFlow();

  useEffect(() => {
    if (!searchTerm) return;

    const match = nodes.find(node => {
      const label =
        node.data?.searchLabel || "";

      return label
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        );
    });

    if (match) {
      setCenter(
        match.position.x,
        match.position.y,
        {
          zoom: 1.2,
          duration: 800
        }
      );
    }
  }, [searchTerm, nodes, setCenter]);

  return null;
}

export default function App() {
  const [treeState, setTreeState] =
    useState(tree);

  const [searchInput, setSearchInput] =
    useState("");

  const [searchTerm, setSearchTerm] =
    useState("");

  // Collapse / expand
  function toggleNode(id, node) {
    if (node.id === id) {
      node.collapsed = !node.collapsed;
    }

    if (node.children) {
      node.children.forEach(child =>
        toggleNode(id, child)
      );
    }
  }

  // Add node
function addNode(id, node) {
  if (node.id === id) {
    const nodeName =
      window.prompt(
        "Enter node name"
      );

    if (!nodeName) return;

    if (!node.children) {
      node.children = [];
    }

    const newId = `Node-${Date.now()}`;

    node.children.push({
      id: newId,
      name: nodeName,
      collapsed: false
    });
  }

  if (node.children) {
    node.children.forEach(child =>
      addNode(id, child)
    );
  }
}

  // Rename node
  function renameNode(
    id,
    node,
    newName
  ) {
    if (node.id === id) {
      node.name = newName;
    }

    if (node.children) {
      node.children.forEach(child =>
        renameNode(
          id,
          child,
          newName
        )
      );
    }
  }

  // Select node
  function setSelected(id, node) {
    node.selected = node.id === id;

    if (node.children) {
      node.children.forEach(child =>
        setSelected(id, child)
      );
    }
  }

  // Search highlight
  function markSearched(node) {
    node.highlighted = false;

    const label =
      node.name || node.id;

    if (
      searchTerm &&
      label
        .toLowerCase()
        .includes(
          searchTerm.toLowerCase()
        )
    ) {
      node.highlighted = true;
    }

    if (node.children) {
      node.children.forEach(child =>
        markSearched(child)
      );
    }
  }

  // Add child
  function handleAddChild(nodeId) {
    const newTree = JSON.parse(
      JSON.stringify(treeState)
    );

    addNode(nodeId, newTree);

    setTreeState(newTree);
  }

  // Collapse handler
  function handleCollapse(nodeId) {
    const newTree = JSON.parse(
      JSON.stringify(treeState)
    );

    toggleNode(nodeId, newTree);

    setTreeState(newTree);
  }

  // Select node
  function handleNodeClick(
    event,
    node
  ) {
    const newTree = JSON.parse(
      JSON.stringify(treeState)
    );

    setSelected(node.id, newTree);

    setTreeState(newTree);
  }

  // Rename handler
  function handleRename(nodeId) {
    const newName =
      window.prompt(
        "Enter new node name"
      );

    if (!newName) return;

    const newTree = JSON.parse(
      JSON.stringify(treeState)
    );

    renameNode(
      nodeId,
      newTree,
      newName
    );

    setTreeState(newTree);
  }

  // Clone tree
  const clonedTree = JSON.parse(
    JSON.stringify(treeState)
  );

  // Apply search highlights
  markSearched(clonedTree);

  // Layout tree
  const layoutedTree =
    layoutTree(clonedTree);

  // Convert to ReactFlow
  const { nodes, edges } =
    convertToFlow(
      layoutedTree,
      handleAddChild,
      handleCollapse,
      handleRename
    );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative"
      }}
    >
      {/* Search Box */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 100,

          display: "flex",
          alignItems: "center",

          background: "white",

          borderRadius: "12px",

          overflow: "hidden",

          boxShadow:
            "0 4px 10px rgba(0,0,0,0.1)"
        }}
      >
        <input
          type="text"
          placeholder="Search node..."
          value={searchInput}
          onChange={e =>
            setSearchInput(
              e.target.value
            )
          }

          style={{
            padding: "12px 16px",
            border: "none",
            width: "240px",
            fontSize: "14px",
            outline: "none"
          }}
        />

        <button
          onClick={() =>
            setSearchTerm(searchInput)
          }

          style={{
            border: "none",

            background: "#0f172a",

            color: "white",

            padding: "12px 16px",

            cursor: "pointer",

            fontSize: "16px"
          }}
        >
          🔍
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView={true}
        fitViewOptions={{
          padding: 0.4
        }}
        defaultViewport={{
          x: 0,
          y: 0,
          zoom: 0.8
        }}
        panOnDrag={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        minZoom={0.2}
        maxZoom={2}
        nodesDraggable={false}
        elementsSelectable={false}
        nodesConnectable={false}
        onNodeClick={
          handleNodeClick
        }
      >
        <SearchFocus
          searchTerm={searchTerm}
          nodes={nodes}
        />

        <MiniMap
          nodeColor={() =>
            "rgba(100,100,100,0.4)"
          }
          maskColor="rgba(0,0,0,0.1)"
        />

        <Background />
        <Controls />
        <CenterButton />
      </ReactFlow>
    </div>
  );
}