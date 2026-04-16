import React, { useEffect, useMemo, useState } from "react";
import ReactFlow, { Position } from "reactflow";
import dagre from "dagre";
import { useNavigate } from "react-router-dom";

import "reactflow/dist/style.css";
import * as graphService from '../../services/graphService';

const nodeTypes = {};
const edgeTypes = {};

const Graph = () => {
    const navigate = useNavigate();
    const [graphData, setGraphData] = useState({ Nodes: [], Edges: [] });

    const updateInfo = () => {
        graphService.getGraphData()
            .then(res => {
                setGraphData(res ?? { Nodes: [], Edges: [] });
            })
    }

    useEffect(() => {
        updateInfo();
    }, []);

    const nodeWidth = 90;
    const nodeHeight = 90;

    const getLayoutedElements = (nodes, edges) => {
        const g = new dagre.graphlib.Graph();
        g.setDefaultEdgeLabel(() => ({}));
        g.setGraph({
            rankdir: "LR",
            ranksep: 150,
            nodesep: 200,
            edgesep: 50,
        });

        nodes.forEach((node) => {
            g.setNode(node.id, { width: nodeWidth, height: nodeHeight });
        });

        edges.forEach((edge) => {
            g.setEdge(edge.source, edge.target);
        });

        dagre.layout(g);

        return {
            nodes: nodes.map((node) => {
                const pos = g.node(node.id);
                return {
                    ...node,
                    position: {
                        x: pos.x - nodeWidth / 2,
                        y: pos.y - nodeHeight / 2,
                    },
                };
            }),
            edges,
        };
    };

    const { nodes, edges } = useMemo(() => {
        const sourceNodes = graphData?.nodes ?? [];
        const sourceEdges = graphData?.edges ?? [];

        const nodesFromApi = sourceNodes.map((node) => {
            return {
                id: String(node.id),
                data: { label: node.name ?? `Node ${node.id}` },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                style: {
                    width: nodeWidth,
                    height: nodeHeight,
                    borderRadius: "50%",
                    border: "2px solid #1f2937",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    fontWeight: 600,
                },
            };
        });

        const edgesFromApi = sourceEdges.map((edge) => {
            const edgeId = edge.id ?? `e-${edge.fromNodeId}-${edge.toNodeId}`;

            return {
                id: String(edgeId),
                source: String(edge.fromNodeId),
                target: String(edge.toNodeId),
                label: edge.length != null ? String(edge.length) : undefined,
                type: "straight",
                style: { strokeWidth: 2 },
                labelStyle: {
                    fontSize: 16,
                    fontWeight: 700,
                    fill: "#111827",
                },
                labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
                labelBgPadding: [8, 4],
                labelBgBorderRadius: 6,
            };
        });

        return getLayoutedElements(nodesFromApi, edgesFromApi);
    }, [graphData]);

    const handleNodeClick = (_event, node) => {
        navigate(`/node/${encodeURIComponent(node.id)}`);
    };

    const handleEdgeClick = (_event, edge) => {
        navigate(`/edge/${encodeURIComponent(edge.id)}`);
    };

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodeClick={handleNodeClick}
                onEdgeClick={handleEdgeClick}
                fitView
            />
        </div>
    );
}

export default Graph;