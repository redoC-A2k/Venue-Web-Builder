import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Screens/Login.jsx';
import Steps from './Screens/Steps.js';
import Editor from './Screens/Editor.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path='/steps' element={<Steps />} />
        <Route exact path='/editor' element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
