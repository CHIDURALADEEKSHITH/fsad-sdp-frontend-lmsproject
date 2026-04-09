import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Style.css'
import { useAuth } from '../context/AuthContext'

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { loginAs } = useAuth()
//
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:2910/adminapi/login', formData)
      if (response.status === 200) {
        sessionStorage.setItem('loggedInAdmin', JSON.stringify(response.data))
        loginAs('admin')
        navigate('/admin/home')
      }
    } catch (err) {
      setMessage('')
      if (err.response?.status === 401) setError(err.response.data)
      else if (err.response?.status === 500) setError('Internal Server Error')
      else if (err.request) setError('Network Error - Server not responding')
      else setError('Bad Request')
    }
  }

  return (
    <div className="login-page">
      <div className="login-page-body">
        <div className="login-card login-card-admin">
          <h2 className="login-title">Admin Login</h2>
          <p className="login-subtitle">Sign in to access the admin panel</p>
          {message && <div className="form-message form-message-success">{message}</div>}
          {error && <div className="form-message form-message-error">{error}</div>}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input type="text" name="username" placeholder="Enter username" value={formData.username} onChange={e => setFormData({...formData, [e.target.name]: e.target.value})} required maxLength={50} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="Enter password" value={formData.password} onChange={e => setFormData({...formData, [e.target.name]: e.target.value})} required maxLength={50} />
            </div>
            <button type="submit" className="login-btn">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin