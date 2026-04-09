import React, { useState } from 'react'
import axios from 'axios'
import './Admin.css'

const AddTeacher = () => {
  const [formData, setFormData] = useState({
    name: '', department: '', username: '',
    password: '', email: '', contact: '', designation: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:2910/adminapi/addteacher', formData)
      setMessage(response.data)
      setError('')
      setFormData({ name: '', department: '', username: '', password: '', email: '', contact: '', designation: '' })
    } catch (err) {
      setMessage('')
      if (err.response?.status === 500) setError('Internal Server Error')
      else if (err.request) setError('Network Error - Server not responding')
      else setError('Bad Request')
    }
  }

  return (
    <div className="admin-section-card">
      <div className="admin-section-header">
        <h2>Add Teacher</h2>
        <p>Fill in the details below to register a new teacher</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="admin-form-item">
            <label className="admin-form-label">Full Name</label>
            <input type="text" name="name" placeholder="Enter full name" value={formData.name} onChange={handleChange} required maxLength={100} />
          </div>
          <div className="admin-form-item">
            <label className="admin-form-label">Email</label>
            <input type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required maxLength={100} />
          </div>
          <div className="admin-form-item">
            <label className="admin-form-label">Contact</label>
            <input type="text" name="contact" placeholder="Enter contact number" value={formData.contact} onChange={handleChange} required maxLength={50} />
          </div>
          <div className="admin-form-item">
            <label className="admin-form-label">Username</label>
            <input type="text" name="username" placeholder="Enter username" value={formData.username} onChange={handleChange} required maxLength={50} />
          </div>
          <div className="admin-form-item">
            <label className="admin-form-label">Password</label>
            <input type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} required maxLength={50} />
          </div>
          <div className="admin-form-item">
            <label className="admin-form-label">Department</label>
            <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>
          <div className="admin-form-item">
            <label className="admin-form-label">Designation</label>
            <select name="designation" value={formData.designation} onChange={handleChange} required>
              <option value="">Select Designation</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="HOD">HOD</option>
            </select>
          </div>
          <button type="submit" className="admin-primary-btn">Add Teacher</button>
        </div>
      </form>
      {message && <div className="admin-success">{message}</div>}
      {error && <div className="admin-error">{error}</div>}
    </div>
  )
}

export default AddTeacher