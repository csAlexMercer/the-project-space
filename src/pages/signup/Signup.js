import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'
import './Signup.css'


export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [thumbnail, setThumbnail] = useState()
  const [thumbnailError, setThumbnailError] = useState()
  const { signup, isPending, error } = useSignup()

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(email,password,displayName,thumbnail)
    
  }

  const handleFileChange = (e) => {
    setThumbnail(null)
    let selected = e.target.files[0]

    if(!selected){
      setThumbnailError('Please select a file!')
      return
    }
    if(!selected.type.includes('image')){
      setThumbnailError('Please select an image!')
      return
    }
    if(selected.size > 100000){
      setThumbnailError('Please select an image of size less than 100kb!')
      return
    }

    setThumbnailError(null)
    setThumbnail(selected)
    console.log('thumbnail updated')
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
      {!isPending && <button className='btn'>Sign Up</button>}
      {isPending && <button className='btn' disabled>Signing up..</button>}
      {error && <div className='error'>{error}</div>}

    </form>
  )
}
