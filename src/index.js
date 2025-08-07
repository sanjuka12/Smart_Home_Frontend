import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // For routing
import './index.css'; // Global styles
import App from './App'; // Main app component
import reportWebVitals from './reportWebVitals'; // Optional performance metrics
import { SpeedInsights } from "@vercel/speed-insights/react"

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <>
        {/* Global SVG Arrow Marker Definition */}
        <svg width="0" height="0">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="0"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#33aadd" />
            </marker>
          </defs>
        </svg>

        {/* Main App */}
        <App />
      </>
    </BrowserRouter>
  </React.StrictMode>
);

// Optional performance reporting
reportWebVitals();
