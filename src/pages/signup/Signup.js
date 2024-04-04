import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'
import './Signup.css'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailError, setThumbnailError] = useState('')
  const [department, setDepartment] = useState('Development') // Default department

  const { signup, isPending, error } = useSignup()

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(email, password, displayName, thumbnail, department)
  }

  const handleFileChange = (e) => {
    setThumbnail(null)
    let selected = e.target.files[0]

    if (!selected) {
      setThumbnailError('Please select a file!')
      return
    }
    if (!selected.type.includes('image')) {
      setThumbnailError('Please select an image!')
      return
    }
    if (selected.size > 100000) {
      setThumbnailError('Please select an image of size less than 100kb!')
      return
    }

    setThumbnailError('')
    setThumbnail(selected)
  }

  return (
    <form className='auth-form' onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      <label>
        <span>Email:</span>
        <input required type='email' onChange={(e) => setEmail(e.target.value)} value={email}/>
      </label>
      <label>
        <span>Password:</span>
        <input required type='password' onChange={(e) => setPassword(e.target.value)} value={password}/>
      </label>
      <label>
        <span>Display Name:</span>
        <input required type='text' onChange={(e) => setDisplayName(e.target.value)} value={displayName}/>
      </label>
      <label>
        <span>Profile Picture:</span>
        <input required type='file' onChange={handleFileChange}/>
        {thumbnailError && <div className='error'>{thumbnailError}</div>}
      </label>
      <label>
        <span>Department:</span>
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="Development">Development</option>
          <option value="Design">Design</option>
          <option value="Sales">Sales</option>
          <option value="Marketing">Marketing</option>
          <option value="Manager">Management</option>
        </select>
      </label>
      {!isPending && <button className='btn'>Sign Up</button>}
      {isPending && <button className='btn' disabled>Signing up..</button>}
      {error && <div className='error'>{error}</div>}
    </form>
  )
}
