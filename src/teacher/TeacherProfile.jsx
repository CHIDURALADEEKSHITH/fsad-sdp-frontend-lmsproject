import React, { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import './Teacher.css'

const TeacherProfile = () => {
  const teacher = JSON.parse(sessionStorage.getItem('loggedInTeacher'))
//
  const [formData, setFormData] = useState({
    id: teacher?.id || '',
    contact: teacher?.contact || '',
    designation: teacher?.designation || '',
    department: teacher?.department || '',
    password: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE_URL}/teacherapi/updateprofile`, formData)
      setMessage(response.data)
      setError('')
      sessionStorage.setItem('loggedInTeacher', JSON.stringify({ ...teacher, ...formData }))
    } catch (err) {
      setMessage('')
      if (err.response?.status === 500) setError('Internal Server Error')
      else if (err.request) setError('Network Error - Server not responding')
      else setError('Bad Request')
    }
  }

  return (
    <div>
      <div className="teacher-section-card">
        <div className="teacher-section-header">
          <h2>My Profile</h2>
          <p>Your personal information and details</p>
        </div>
        <div className="teacher-profile-grid">
          <div className="teacher-info-item">
            <span className="teacher-info-label">Full Name</span>
            <span className="teacher-info-value">{teacher?.name || '-'}</span>
          </div>
          <div className="teacher-info-item">
            <span className="teacher-info-label">Email</span>
            <span className="teacher-info-value">{teacher?.email || '-'}</span>
          </div>
          <div className="teacher-info-item">
            <span className="teacher-info-label">Username</span>
            <span className="teacher-info-value">{teacher?.username || '-'}</span>
          </div>
          <div className="teacher-info-item">
            <span className="teacher-info-label">Department</span>
            <span className="teacher-info-value">{teacher?.department || '-'}</span>
          </div>
          <div className="teacher-info-item">
            <span className="teacher-info-label">Designation</span>
            <span className="teacher-info-value">{teacher?.designation || '-'}</span>
          </div>
          <div className="teacher-info-item">
            <span className="teacher-info-label">Contact</span>
            <span className="teacher-info-value">{teacher?.contact || '-'}</span>
          </div>
        </div>
      </div>

      <div className="teacher-section-card">
        <div className="teacher-section-header">
          <h2>Update Profile</h2>
          <p>You can update your contact, designation, department and password</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="teacher-form-grid">
            <div className="teacher-form-item">
              <label className="teacher-form-label">Contact Number</label>
              <input type="text" name="contact" placeholder="Enter new contact" value={formData.contact} onChange={handleChange} required maxLength={50} />
            </div>
            <div className="teacher-form-item">
              <label className="teacher-form-label">Designation</label>
              <select name="designation" value={formData.designation} onChange={handleChange} required>
                <option value="">Select Designation</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="HOD">HOD</option>
              </select>
            </div>
            <div className="teacher-form-item">
              <label className="teacher-form-label">Department</label>
              <select name="department" value={formData.department} onChange={handleChange} required>
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>
            <div className="teacher-form-item">
              <label className="teacher-form-label">New Password</label>
              <input type="password" name="password" placeholder="Enter new password" value={formData.password} onChange={handleChange} required maxLength={50} />
            </div>
            <button type="submit" className="teacher-primary-btn">Update Profile</button>
          </div>
        </form>
        {message && <div className="teacher-success">{message}</div>}
        {error && <div className="teacher-error">{error}</div>}
      </div>
    </div>
  )
}

export default TeacherProfile

