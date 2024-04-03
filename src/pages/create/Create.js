import { useState } from 'react'
import Select from 'react-select'
import { useCollection } from '../../hooks/useCollection'
import { useAuthContext } from '../../hooks/useAuthContext'
import { timestamp } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
import { useHistory } from 'react-router-dom'

// styles
import './Create.css'
import { useEffect } from 'react'

const categories = [
  { value: 'development', label: 'development'},
  { value: 'design', label: 'design'},
  { value: 'sales', label: 'sales'},
  { value: 'marketing', label: 'marketing'}
]

export default function Create() {
  const history = useHistory()
  const { addDocument, response } = useFirestore('projects')
  const { user } = useAuthContext()
  const { documents } = useCollection('users')
  const [users, setUsers] = useState([])
  const [formError, setFormError] = useState(null)
  // form field values
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([])

  useEffect(() => {
    if (documents) {
      setUsers(documents.map(user => {
        return { value: user, label: user.displayName }
      }))
    }
  }, [documents])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!category) {
      setFormError('Please select a category.')
      return
    }
    if (assignedUsers.length < 1) {
      setFormError('Assign the project to at least one user.')
      return
    }

    const assignedUsersList = assignedUsers.map(u => {
      return {
        displayName: u.value.displayName,
        photoURL: u.value.photoURL,
        id: u.value.id
      }
    })
    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid
    }

    const project = {
      name,
      details,
      category: category.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      assignedUsersList,
      createdBy,
      comments: []
    }

    await addDocument(project)
    if (!response.error) {
      history.push('/')
    }
  }

  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z ]/ig, '') // Accepts only alphabetical characters and spaces
    setName(value)
  }

  const handleDetailsChange = (e) => {
    const value = e.target.value.replace(/[^A-Za-z ]/ig, '') // Accepts only alphabetical characters and spaces
    setDetails(value)
  }

  return (
    <div className="create-form">
      <h2 className="page-title">Create a new Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project name:</span>
          <input
            required
            type="text"
            onChange={handleNameChange} // Updated to handle only alphabetical characters
            value={name}
          />
        </label>
        <label>
          <span>Project Details:</span>
          <textarea
            required
            onChange={handleDetailsChange} // Updated to handle only alphabetical characters
            value={details}
          ></textarea>
        </label>
        <label>
          <span>Set due date:</span>
          <input
            required
            type="date"
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
          />
        </label>
        <label>
          <span>Project category:</span>
          <Select
            onChange={(option) => setCategory(option)}
            options={categories} />
        </label>
        <label>
          <span>Assign to:</span>
          <Select
            onChange={(option) => setAssignedUsers(option)}
            options={users} isMulti />
        </label>

        <button className="btn">Add Project</button>
        {formError && <p className='error'>{formError}</p>}
      </form>
    </div>
  )
}
