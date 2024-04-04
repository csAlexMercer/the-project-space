import { Link } from 'react-router-dom';
import './ProjectList.css';
import Avatar from '../components/Avatar';

export default function ProjectList({ projects, filter }) {
  const currentDate = new Date();

  const filteredProjects = projects.filter(project => {
    if (filter === 'Active') {
      return !project.markedComplete;
    } else if (filter === 'Completed') {
      return project.markedComplete;
    }
    return true;
  });

  return (
    <div className="project-list">
      {filteredProjects.length === 0 && <p>No projects yet!</p>}
      {filteredProjects.map(project => (
        <Link to={`/projects/${project.id}`} key={project.id}>
          <h4>{project.name}</h4>
          <p>Due by {project.dueDate.toDate().toDateString()}</p>
          {currentDate > project.dueDate.toDate() && <p className="due-date-reached">Due date reached</p>}
          <div className='assigned-to'>
            <p><strong>Assigned to:</strong></p>
            <ul>
              {project.assignedUsersList.map(user => (
                <li key={user.photoURL} >
                  <Avatar src={user.photoURL}/>
                </li>
              ))}
            </ul>
          </div>
        </Link>
      ))}
    </div>
  );
}
