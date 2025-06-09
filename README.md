# Bio-Inspired Adaptive UI System

A React-based prototype that implements ant colony optimization (ACO) and slime mold algorithms to create adaptive user interfaces. The system visualizes and optimizes user journeys based on pheromone trail logic and emergent network optimization.

## Features

- Interactive graph visualization using p5.js
- Real-time pheromone trail updates
- Adaptive navigation based on path efficiency
- Simulated ant agents that traverse the graph
- Dynamic edge weight visualization
- Draggable node positions

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd slimy-ux
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`.

## Usage

1. The graph visualization shows nodes (pages) and edges (navigation paths) with varying thickness based on pheromone strength.
2. Click and drag nodes to rearrange the layout.
3. Use the adaptive navigation bar at the top to navigate between pages.
4. Watch as ant agents traverse the graph and reinforce successful paths.
5. The system will automatically adapt the navigation structure based on user behavior.

## Technical Details

### Components

- `BioGraph`: Main visualization component using p5.js
- `AdaptiveNav`: Dynamic navigation component that reorders based on pheromone values
- `App`: Main application component that manages state and coordinates components

### Data Structure

The system uses a graph-based data structure:

```typescript
interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface Node {
  id: string;
  label: string;
  x?: number;
  y?: number;
}

interface Edge {
  source: string;
  target: string;
  pheromoneStrength: number;
  label?: string;
}
```

### ACO Algorithm

The ant colony optimization algorithm is implemented with the following parameters:

- Evaporation rate: 0.1
- Pheromone deposit: 0.5
- Minimum pheromone: 0.1
- Maximum pheromone: 1.0
- Number of ants: 5

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 