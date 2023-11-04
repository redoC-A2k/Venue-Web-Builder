import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Screens/Login.jsx';

function App() {
  let app 
  useEffect(() => { 
  })
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
