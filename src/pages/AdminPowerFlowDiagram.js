
// PowerFlowDiagramAdmin.js
import React, { useState, useEffect } from 'react';
import { Plug, Sun, Home } from 'lucide-react';
import './AdminPowerFlowDiagram.css';

export default function AdminPowerFlowDiagram() {
  
  return (
    <div className="admin-power-flow-container">
      <div className="admin-icon-wrapper-solar">
        <Sun size={30} />
        <p>Solar Yield</p>
      </div>

      <div className="admin-icon-wrapper-home">
        <Home size={30} />
        <p>Load</p>
      </div>

    
      <div className="admin-icon-wrapper-grid" style={{ gap: '5px' }}>
        <Plug size={30} />
        <p>Grid</p>
      </div>

      {/* SVG Arrows */}
      <svg className="admin-arrows" width="300" height="200" viewBox="0 -100 300 300">


            <line x1="10" y1="160" x2="290" y2="160" stroke="#03389bff" strokeWidth="3" />
            <path id="admin-pathSolarLoad" d="M 10 160 L 290 160" fill="none" />
            <g fill="#03389bff" stroke="none">
              <polygon points="0,-10 20,0 0,10" />
              <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#admin-pathSolarLoad" />
              </animateMotion>
            </g>
          
      
            <line x1="-10" y1="110" x2="125" y2="-50" stroke="#b60404ff" strokeWidth="3" />
            <path id="admin-pathSolarGrid" d="M -10 110 L 125 -50" fill="none" />
            <g fill="#b60404ff" stroke="none">
              <polygon points="0,-10 20,0 0,10" />
              <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#admin-pathSolarGrid" />
              </animateMotion>
            </g>
          
            <line x1="175" y1="-50" x2="310" y2="110" stroke="#018411ff" strokeWidth="3" />
            <path id="admin-pathGridLoad" d="M 175 -50 L 310 110" fill="none" />
            <g fill="#018411ff" stroke="none">
              <polygon points="0,-10 20,0 0,10" />
              <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#admin-pathGridLoad" />
              </animateMotion>
            </g>
         

        


      </svg>
    </div>
  );
}

