import { useState } from 'react';
import { useCollection } from '../../hooks/useCollection';
import ProjectList from '../../components/ProjectList';
import './Dashboard.css';

export default function Dashboard() {
  const { documents, error } = useCollection('projects');
  const [filter, setFilter] = useState('Active');

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  return (
    <div>
      <h2 className='page-title'>Dashboard</h2>
      <div className='filter-bar'>
        <span className={`filter-option ${filter === 'Active' && 'active'}`} onClick={() => handleFilterChange('Active')}>Active Projects</span>
        <span className={`filter-option ${filter === 'Completed' && 'active'}`} onClick={() => handleFilterChange('Completed')}>Completed Projects</span>
      </div>
      {error && <p className='error'>{error}</p>}
      {documents && <ProjectList projects={documents} filter={filter} />}
    </div>
  );
}
