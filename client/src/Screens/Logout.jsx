import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase';

function Logout(){
    const navigate = useNavigate();
    const logout = () => {
        auth.signOut().then(() => {
            navigate('/login')
        }).catch((error) => {
            console.log(error)
        })
    }
    return(
        <div>
            <h1>Logout</h1>
            <button onClick={logout}>Click to logout</button>
        </div>
    )
}
export default Logout;