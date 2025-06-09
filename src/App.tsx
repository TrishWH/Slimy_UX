import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import BioGraph from './components/BioGraph';
import AdaptiveNav from './components/AdaptiveNav';
import { GraphData, Node, Edge, ACO_CONSTANTS } from './types';
import { processCSVData } from './utils/dataProcessor';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
`;

const Content = styled.main`
  display: grid;
  gap: 2rem;
`;

const FileUpload = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.label`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #0056b3;
  }
`;

// Sample initial data
const initialData: GraphData = {
  nodes: [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'cart', label: 'Cart' },
    { id: 'checkout', label: 'Checkout' }
  ],
  edges: [
    { source: 'home', target: 'products', pheromoneStrength: 0.9 },
    { source: 'products', target: 'cart', pheromoneStrength: 0.8 },
    { source: 'cart', target: 'checkout', pheromoneStrength: 0.85 },
    { source: 'home', target: 'cart', pheromoneStrength: 0.6 },
    { source: 'products', target: 'checkout', pheromoneStrength: 0.4 }
  ]
};

const App: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData>(initialData);

  const handleNodeClick = useCallback((node: Node) => {
    console.log('Node clicked:', node);
  }, []);

  const handleEdgeClick = useCallback((edge: Edge) => {
    console.log('Edge clicked:', edge);
  }, []);

  const handleNavigate = useCallback((target: string) => {
    // Simulate pheromone reinforcement
    setGraphData(prevData => {
      const newEdges = prevData.edges.map(edge => {
        if (edge.target === target) {
          return {
            ...edge,
            pheromoneStrength: Math.min(
              edge.pheromoneStrength + ACO_CONSTANTS.PHEROMONE_DEPOSIT,
              ACO_CONSTANTS.MAX_PHEROMONE
            )
          };
        }
        return {
          ...edge,
          pheromoneStrength: Math.max(
            edge.pheromoneStrength * (1 - ACO_CONSTANTS.EVAPORATION_RATE),
            ACO_CONSTANTS.MIN_PHEROMONE
          )
        };
      });

      return {
        ...prevData,
        edges: newEdges
      };
    });
  }, []);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        try {
          const newGraphData = processCSVData(content);
          setGraphData(newGraphData);
        } catch (error) {
          console.error('Error processing CSV:', error);
          alert('Error processing CSV file. Please check the format.');
        }
      }
    };
    reader.readAsText(file);
  }, []);

  return (
    <AppContainer>
      <Header>
        <Title>Bio-Inspired Adaptive UI</Title>
        <Subtitle>Ant Colony Optimization for User Journey Optimization</Subtitle>
      </Header>
      
      <FileUpload>
        <FileInput
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          id="csv-upload"
        />
        <UploadButton htmlFor="csv-upload">
          Upload Journey Data (CSV)
        </UploadButton>
      </FileUpload>

      <Content>
        <AdaptiveNav
          edges={graphData.edges}
          onNavigate={handleNavigate}
        />
        
        <BioGraph
          data={graphData}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
        />
      </Content>
    </AppContainer>
  );
};

export default App; 