// PowerFlowDiagram.js
import React from 'react';
import { Plug } from 'lucide-react';

import {
  Sun,
  Home,
  BatteryCharging,
  Transmission
} from 'lucide-react';
import './PowerFlowDiagram.css';

const PowerFlowDiagram = () => {
  return (
    <div className="power-flow-container">
  <div className="icon-wrapper solar">
    <Sun size={30} />
    <p>Solar YIeld</p>
  </div>

  <div className="icon-wrapper home">
    <Home size={30} />
    
    <p>Load</p>
  </div>

  <div className="icon-wrapper battery">
    <BatteryCharging size={30} />
    <p>Battery</p>
  </div>

  <div className="icon-wrapper grid">
    <Plug size={30} />
    <p>Grid</p>
  </div>
   {/* Arrows */}

</div>

  );
};



export default PowerFlowDiagram;
