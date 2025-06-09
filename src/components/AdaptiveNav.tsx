import React from 'react';
import styled from 'styled-components';
import { Edge } from '../types';

const NavContainer = styled.nav`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NavLink = styled.a<{ strength: number }>`
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #333;
  border-radius: 4px;
  transition: all 0.3s ease;
  font-weight: ${props => props.strength > 0.7 ? 'bold' : 'normal'};
  opacity: ${props => 0.5 + props.strength * 0.5};
  
  &:hover {
    background: #f0f0f0;
  }
`;

interface AdaptiveNavProps {
  edges: Edge[];
  onNavigate: (target: string) => void;
}

const AdaptiveNav: React.FC<AdaptiveNavProps> = ({ edges, onNavigate }) => {
  // Sort edges by pheromone strength
  const sortedEdges = [...edges].sort((a, b) => b.pheromoneStrength - a.pheromoneStrength);

  return (
    <NavContainer>
      {sortedEdges.map((edge) => (
        <NavLink
          key={`${edge.source}-${edge.target}`}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onNavigate(edge.target);
          }}
          strength={edge.pheromoneStrength}
        >
          {edge.label || `${edge.source} → ${edge.target}`}
        </NavLink>
      ))}
    </NavContainer>
  );
};

export default AdaptiveNav; 