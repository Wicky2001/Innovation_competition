import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Import necessary components

//import Desktop from './Coponents/Pages/Desktop';
import PDF from './Coponents/Pages/pdf';

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Routes> {/* Use Routes instead of Switch */}
            <Route exact path="/" element={/*<Desktop />*/<PDF />} /> {/* Use element prop instead of component */}
          </Routes>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
