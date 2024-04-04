import { NavLink } from 'react-router-dom/cjs/react-router-dom.min'
import { useAuthContext } from '../hooks/useAuthContext'
// import { useCollection } from '../hooks/useCollection'
import './Sidebar.css'
import DashboardIcon from '../assets/dashboard_icon.svg'
import AddIcon from '../assets/add_icon.svg'
import Avatar from './Avatar'

export default function Sidebar() {
    const { user } = useAuthContext()
    return (
        <div className='sidebar'>
            <div className='sidebar-content'>
                <div className='user'>
                    <Avatar src={user.photoURL}/>
                    <div>
                        <p>Hey {user.displayName}</p>
                        <p className='department'>{user.department}</p>
                    </div>
                </div>
                <nav className='links'>
                    <ul>
                        <li>
                            <NavLink exact to='/'>
                                <img src={DashboardIcon} alt='dashboard icon'/>
                                <span>Dashboard</span>
                            </NavLink>
                        </li>
                        {user.department == "Manager" && <li>
                            <NavLink to='/create'>
                                <img src={AddIcon} alt='addicon'/>
                                <span>New Project</span>
                            </NavLink>
                        </li>}
                    </ul>
                </nav>
            </div>     
        </div>
    )
}
