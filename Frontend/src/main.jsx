// src/main.jsx
import ReactDOM from 'react-dom/client';
import React from 'react';
import App from './App.jsx';
import {BrowserRouter} from 'react-router-dom'
import './index.css'; // Global styles


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);