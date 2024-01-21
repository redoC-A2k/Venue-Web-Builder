import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Screens/Login.jsx';
import Steps from './Screens/Steps.js';
import Editor from './Screens/Editor.jsx';
import Loader from './Screens/Loader.jsx';
import Manage from './Screens/Manage.jsx';
import { Toaster } from 'react-hot-toast';
import Logout from './Screens/Logout.jsx';
import Bookings from './Screens/Bookings.jsx';

function App() {
  return (
    <>
      <Loader />
      <Toaster
        toastOptions={{
          style:{
            border: '2px solid rgba(var(--primary-green-yellow),1)',
          },
          success: {
            style: {
              padding: '10px',
              marginTop:"6rem"
            },
          }
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path='/steps' element={<Steps />} />
          <Route exact path='/manage' element={<Manage />} />
          <Route exact path='/logout' element={<Logout />} />
          <Route exact path='/bookings' element={<Bookings />} />
          <Route exact path='/' element={<Editor />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
