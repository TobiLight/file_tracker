import React from 'react';
import './assets/index.css';
import { BrowserRouter } from "react-router-dom";
import "antd/dist/antd.css"
import { Routers } from './Routers';


function App() {
  return (
    <BrowserRouter>
      <Routers />
    </BrowserRouter>
  );
}

export default App;
