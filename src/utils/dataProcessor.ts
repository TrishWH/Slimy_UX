import { GraphData, Node, Edge } from '../types';

interface JourneyEdge {
  source: string;
  target: string;
  weight: number;
  label?: string;
}

export const parseCSV = (csvContent: string): JourneyEdge[] => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const edge: JourneyEdge = {
      source: values[0],
      target: values[1],
      weight: parseFloat(values[2]),
      label: values[3] || undefined
    };
    return edge;
  });
};

export const convertToGraphData = (edges: JourneyEdge[]): GraphData => {
  // Extract unique nodes from edges
  const nodeSet = new Set<string>();
  edges.forEach(edge => {
    nodeSet.add(edge.source);
    nodeSet.add(edge.target);
  });

  // Create nodes array
  const nodes: Node[] = Array.from(nodeSet).map(id => ({
    id,
    label: id.charAt(0).toUpperCase() + id.slice(1) // Capitalize first letter
  }));

  // Create edges array
  const graphEdges: Edge[] = edges.map(edge => ({
    source: edge.source,
    target: edge.target,
    pheromoneStrength: edge.weight,
    label: edge.label
  }));

  return { nodes, edges: graphEdges };
};

export const processCSVData = (csvContent: string): GraphData => {
  const edges = parseCSV(csvContent);
  return convertToGraphData(edges);
}; 