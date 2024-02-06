import { Route, Routes } from 'react-router-dom';
import Login from './Screens/Login.jsx';
import Steps from './Screens/Steps.js';
import Editor from './Screens/Editor.jsx';
import Loader from './Screens/Loader.jsx';
import Queries from './Screens/Queries.jsx';
import { Toaster } from 'react-hot-toast';
import Logout from './Screens/Logout.jsx';
import Events from './Screens/Events.jsx';
import {  useEffect, useState } from 'react';
import {  showLoader } from './utils/loader.js';

import { createContext } from 'react'
import { auth } from './firebase.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'

export const globalContext = createContext({})

function App() {
    const [user, setUser] = useState(undefined)
    const [stepsData, setStepsData] = useState(undefined)
    const navigate = useNavigate()
    useEffect(() => {
        showLoader()
        auth.onAuthStateChanged(async (firebaseUser) => {
            try {
                if (firebaseUser != undefined) {
                    let token = await firebaseUser.getIdToken();
                    let response = await axios.get(process.env.REACT_APP_HOSTNAME + "/venue/web/steps", {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token
                        }
                    })
                    setStepsData(response.data)
                    if (response.data.steps === false)
                        navigate("/steps")
                    setUser(firebaseUser)
                } else {
                    navigate("/login")
                }
            } catch (error) {
                console.log(error)
                navigate("/login")
            }
        })
    }, [])
    return (
        <>
            <Loader />
            <Toaster
                toastOptions={{
                    style: {
                        border: '2px solid rgba(var(--primary-green-yellow),1)',
                    },
                    success: {
                        style: {
                            padding: '10px',
                            marginTop: "6rem"
                        },
                    },
                    error: {
                        style: {
                            padding: '10px',
                            marginTop: "6rem",
                            border: '2px solid rgba(var(--primary-red),0.8)',
                        }
                    }
                }}
            />
            <globalContext.Provider value={{ user, stepsData }}>
                <Routes>
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path='/steps' element={<Steps />} />
                    <Route exact path='/queries' element={<Queries />} />
                    <Route exact path='/logout' element={<Logout />} />
                    <Route exact path='/events' element={<Events />} />
                    <Route exact path='/' element={<Editor />} />
                </Routes>
            </globalContext.Provider>
        </>
    );
}

export default App;
