import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Screens/Login.jsx';
import Steps from './Screens/Steps.js';
import Editor from './Screens/Editor.jsx';
import Loader from './Screens/Loader.jsx';
import Manage from './Screens/Manage.jsx';

function App() {
  return (
    <>
    <Loader/>
    <BrowserRouter>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path='/steps' element={<Steps />} />
        <Route exact path='/manage' element={<Manage />} />
        <Route exact path='/' element={<Editor />} />

      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
