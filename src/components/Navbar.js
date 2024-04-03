import './Navbar.css'
import Temple from '../assets/temple.svg'

import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'

export default function Navbar() {
  const { logout} = useLogout()
  const {user} = useAuthContext()
  return (
    <div className='navbar'>
        <ul>
            <li className='logo'>
                <img src={Temple} alt='main logo' />
                <span>Project Space</span>
            </li>
            
            {!user &&<li><Link to="/login">Login</Link></li>}
            {!user &&<li><Link to="/signup">SignUp</Link></li>}
            {user &&
            <li>
              <button className='btn' onClick={logout}>Logout</button>
              {/* {isPending && <button className='btn' disabled>Logging out..</button>} */}
            </li>}
        </ul>
      
    </div>
  )
}
