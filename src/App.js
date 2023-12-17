import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Screens/Login.jsx';
import Steps from './Screens/Steps.js';
import Editor from './Screens/Editor.jsx';
import Loader from './Screens/Loader.jsx';

function App() {
  return (
    <>
    <Loader/>
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path='/steps' element={<Steps />} />
        <Route exact path='/' element={<Editor />} />
        <Route exact path='/loader' element={<Loader />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
