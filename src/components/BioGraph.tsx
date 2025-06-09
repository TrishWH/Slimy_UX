import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import styled from 'styled-components';
import { GraphData, Node, Edge, AntAgent, ACO_CONSTANTS } from '../types';

const CanvasContainer = styled.div`
  width: 100%;
  height: 600px;
  background: #f5f5f5;
  border-radius: 8px;
  overflow: hidden;
`;

interface BioGraphProps {
  data: GraphData;
  onEdgeClick?: (edge: Edge) => void;
  onNodeClick?: (node: Node) => void;
}

const BioGraph: React.FC<BioGraphProps> = ({ data, onEdgeClick, onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);
  const ants = useRef<AntAgent[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const sketch = (p: p5) => {
      let nodes: Node[] = [];
      let edges: Edge[] = [];
      let selectedNode: Node | null = null;
      let dragging = false;

      p.setup = () => {
        p.createCanvas(containerRef.current!.offsetWidth, containerRef.current!.offsetHeight);
        nodes = data.nodes;
        edges = data.edges;
        
        // Initialize ant agents
        ants.current = Array.from({ length: ACO_CONSTANTS.NUM_ANTS }, (_, i) => ({
          id: `ant-${i}`,
          currentNode: nodes[0].id,
          path: [nodes[0].id],
          speed: ACO_CONSTANTS.ANT_SPEED
        }));

        // Position nodes in a circular layout
        const centerX = p.width / 2;
        const centerY = p.height / 2;
        const radius = Math.min(p.width, p.height) * 0.4;
        
        nodes.forEach((node, i) => {
          const angle = (i * 2 * Math.PI) / nodes.length;
          node.x = centerX + radius * Math.cos(angle);
          node.y = centerY + radius * Math.sin(angle);
        });
      };

      p.draw = () => {
        p.background(245);
        
        // Draw edges
        edges.forEach(edge => {
          const sourceNode = nodes.find(n => n.id === edge.source);
          const targetNode = nodes.find(n => n.id === edge.target);
          
          if (sourceNode && targetNode && sourceNode.x && sourceNode.y && targetNode.x && targetNode.y) {
            const weight = edge.pheromoneStrength;
            p.stroke(0, 0, 0, weight * 255);
            p.strokeWeight(weight * 5);
            p.line(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y);
          }
        });

        // Draw nodes
        nodes.forEach(node => {
          if (node.x && node.y) {
            p.fill(255);
            p.stroke(0);
            p.strokeWeight(2);
            p.ellipse(node.x, node.y, 40);
            
            p.fill(0);
            p.noStroke();
            p.textAlign(p.CENTER, p.CENTER);
            p.text(node.label, node.x, node.y);
          }
        });

        // Update and draw ants
        updateAnts();
        drawAnts();
      };

      const updateAnts = () => {
        ants.current.forEach(ant => {
          const currentNode = nodes.find(n => n.id === ant.currentNode);
          if (!currentNode) return;

          // Find possible next nodes
          const possibleEdges = edges.filter(e => e.source === ant.currentNode);
          if (possibleEdges.length === 0) return;

          // Choose next node based on pheromone strength
          const totalPheromone = possibleEdges.reduce((sum, edge) => sum + edge.pheromoneStrength, 0);
          let random = Math.random() * totalPheromone;
          
          for (const edge of possibleEdges) {
            random -= edge.pheromoneStrength;
            if (random <= 0) {
              ant.currentNode = edge.target;
              ant.path.push(edge.target);
              break;
            }
          }
        });
      };

      const drawAnts = () => {
        ants.current.forEach(ant => {
          const currentNode = nodes.find(n => n.id === ant.currentNode);
          if (!currentNode || !currentNode.x || !currentNode.y) return;

          p.fill(255, 0, 0);
          p.noStroke();
          p.ellipse(currentNode.x, currentNode.y, 10);
        });
      };

      p.mousePressed = () => {
        nodes.forEach(node => {
          if (node.x && node.y) {
            const d = p.dist(p.mouseX, p.mouseY, node.x, node.y);
            if (d < 20) {
              selectedNode = node;
              dragging = true;
              onNodeClick?.(node);
            }
          }
        });
      };

      p.mouseReleased = () => {
        dragging = false;
        selectedNode = null;
      };

      p.mouseDragged = () => {
        if (dragging && selectedNode) {
          selectedNode.x = p.mouseX;
          selectedNode.y = p.mouseY;
        }
      };
    };

    p5Instance.current = new p5(sketch, containerRef.current);

    return () => {
      p5Instance.current?.remove();
    };
  }, [data, onEdgeClick, onNodeClick]);

  return <CanvasContainer ref={containerRef} />;
};

export default BioGraph; 