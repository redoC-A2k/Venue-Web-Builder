import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Screens/Login.jsx';
import Steps from './Screens/Steps.js';

function App() {
  let app 
  useEffect(() => { 
  })
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path='/steps' element={<Steps />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
