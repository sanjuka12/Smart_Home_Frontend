
// PowerFlowDiagram.js
import React, { useState, useEffect } from 'react';
import { Plug, Sun, Home, BatteryCharging, Transmission } from 'lucide-react';
import './PowerFlowDiagram.css';

export default function PowerFlowDiagram() {
  const [flow, setFlow] = useState({
    solarToBattery: false,
    solarToLoad: false,
    solarToGrid: false,
    gridToLoad: false,
    gridToBattery: false,
    batteryToLoad: false
  });

  // Simulated data from solar/battery/grid inverters
  /*const [solarPower, setSolarPower] = useState(""); // W
  const [batterySOC, setBatterySOC] = useState(""); // %
  const [batteryCharging, setBatteryCharging] = useState("");
  const [gridAvailable, setGridAvailable] = useState("");
  const [loadDemand, setLoadDemand] = useState(""); // W*/

  const solarPower = 0; // W
  const batterySOC = 10; // %
  const gridAvailable = true;
  const batteryCharging = true; // W (positive means importing, negative means exporting)
  const loadDemand = 100; // W

  // This effect updates the flows whenever data changes
  useEffect(() => {
    let newFlow = {
      solarToBattery: false,
      solarToLoad: false,
      solarToGrid: false,
      gridToLoad: false,
      gridToBattery: false,
      batteryToLoad: false
    };

    // Solar to Battery
    if (solarPower > 0 && batterySOC < 100 && batteryCharging && solarPower > loadDemand) {
      newFlow.solarToBattery = true;
    }

    // Solar to Load
    if (solarPower > 0 && loadDemand > 0) {
      newFlow.solarToLoad = true;
    }

    // Solar to Grid
    if (solarPower > loadDemand && batterySOC === 100 && gridAvailable) {
      newFlow.solarToGrid = true;
    }

    // Grid to Load (if solar not enough)
    if (gridAvailable && loadDemand > solarPower && batterySOC <= 20) {
      newFlow.gridToLoad = true;
    }

    // Grid to Battery (if battery low)
    if (gridAvailable && batterySOC < 40 && solarPower === 0 && batteryCharging) {
      newFlow.gridToBattery = true;
    }

    // Battery to Load
    if (solarPower < loadDemand && batterySOC > 20) {
      newFlow.batteryToLoad = true;
    }

    setFlow(newFlow);
  }, [solarPower, batterySOC, batteryCharging, gridAvailable, loadDemand]);

  return (
    <div className="power-flow-container">
      <div className="icon-wrapper solar">
        <Sun size={30} />
        <p>Solar Yield</p>
      </div>

      <div className="icon-wrapper home">
        <Home size={30} />
        <p>Load</p>
      </div>

      <div className="icon-wrapper battery">
        <BatteryCharging size={30} />
        <p>Battery</p>
      </div>

      <div className="icon-wrapper grid" style={{ gap: '5px' }}>
        <Plug size={30} />
        <p>Grid</p>
      </div>
<div className="svg-container">
  <svg className="arrows" width="300" height="200" viewBox="0 -100 400 300" >
    
          {/* Solar → Battery */}
        {flow.solarToBattery && (
          <>
            <line x1="10" y1="30" x2="110" y2="100" stroke="#03389bff" strokeWidth="3" />
            <path id="pathSolarBattery" d="M 10 30 L 110 100" fill="none" />
            <g fill="#03389bff" stroke="none">
              <polygon points="0,-10 20,0 0,10" />
              <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#pathSolarBattery" />
              </animateMotion>
            </g>
          </>
        )}

        {/* Solar → Load */}
        {flow.solarToLoad && (
          <>
            <line x1="10" y1="0" x2="300" y2="0" stroke="#03389bff" strokeWidth="3" />
            <path id="pathSolarLoad" d="M 10 0 L 300 0" fill="none" />
            <g fill="#03389bff" stroke="none">
              <polygon points="0,-10 20,0 0,10" />
              <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#pathSolarLoad" />
              </animateMotion>
            </g>
          </>
        )}

        {/* Solar → Grid */}
        {flow.solarToGrid && (
          <>
            <line x1="0" y1="-20" x2="100" y2="-90" stroke="#03389bff" strokeWidth="3" />
            <path id="pathSolarGrid" d="M 0 -20 L 100 -90" fill="none" />
            <g fill="#03389bff" stroke="none">
              <polygon points="0,-10 20,0 0,10" />
              <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#pathSolarGrid" />
              </animateMotion>
            </g>
          </>
        )}

        {/* Grid → Load */}
        {flow.gridToLoad && (
          <>
            <line x1="190" y1="-90" x2="310" y2="-30" stroke="#018411ff" strokeWidth="3" />
            <path id="pathGridLoad" d="M 190 -90 L 310 -30" fill="none" />
            <g fill="#018411ff" stroke="none">
              <polygon points="0,-10 20,0 0,10" />
              <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#pathGridLoad" />
              </animateMotion>
            </g>
          </>
        )}

        {/* Grid → Battery */}
        {flow.gridToBattery && (
          <>
            <line x1="150" y1="-80" x2="150" y2="100" stroke="#018411ff" strokeWidth="3" />
            <path id="pathGridBattery" d="M 150 -80 L 150 100" fill="none" />
            <g fill="#018411ff" stroke="none">
              <polygon points="0,-10 20,0 0,10" />
              <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#pathGridBattery" />
              </animateMotion>
            </g>
          </>
        )}

        {/* Battery → Load */}
        {flow.batteryToLoad && (
          <>
            <line x1="190" y1="110" x2="310" y2="30" stroke="#9a0101ff" strokeWidth="3" />
            <path id="pathBatteryLoad" d="M 190 110 L 310 30" fill="none" />
            <g fill="#9a0101ff" stroke="none">
              <polygon points="0,-10 20,0 0,10" />
              <animateMotion dur="2s" repeatCount="indefinite" rotate="auto">
                <mpath href="#pathBatteryLoad" />
              </animateMotion>
            </g>
          </>
        )}

      </svg>
      </div>
    </div>
  );
}

