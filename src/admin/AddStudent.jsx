import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import './Admin.css'

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '', gender: '', email: '', contact: '',
    username: '', password: '', department: '', bloodgroup: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE_URL}/adminapi/addstudent`, formData)
      setMessage(response.data)
      setError('')
      setFormData({ name: '', gender: '', email: '', contact: '', username: '', password: '', department: '', bloodgroup: '' })
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
        <h2>Add Student</h2>
        <p>Fill in the details below to register a new student</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="admin-form-item">
            <label className="admin-form-label">Full Name</label>
            <input type="text" name="name" placeholder="Enter full name" value={formData.name} onChange={handleChange} required maxLength={100} />
          </div>
          <div className="admin-form-item">
            <label className="admin-form-label">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="admin-form-item">
            <label className="admin-form-label">Email</label>
            <input type="email" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} required maxLength={100} />
          </div>
          <div className="admin-form-item">
            <label className="admin-form-label">Contact</label>
            <input type="text" name="contact" placeholder="Enter contact number" value={formData.contact} onChange={handleChange} required maxLength={20} />
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
            <label className="admin-form-label">Blood Group</label>
            <select name="bloodgroup" value={formData.bloodgroup} onChange={handleChange} required>
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
          <button type="submit" className="admin-primary-btn">Add Student</button>
        </div>
      </form>
      {message && <div className="admin-success">{message}</div>}
      {error && <div className="admin-error">{error}</div>}
    </div>
  )
}

export default AddStudent

