import React from "react";
import './App.css';

import Header from './components/header.js';
import Workspace from "./components/workspace";
import Footer from "./components/footer";


function App() {
  return (
    <div className="App">
        <Header />
        <Workspace />
        <Footer />
    </div>
  );
}

export default App;
