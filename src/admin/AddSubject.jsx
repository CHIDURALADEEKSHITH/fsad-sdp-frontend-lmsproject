import React, { useState } from 'react'
import axios from 'axios'
import './Admin.css'

const AddSubject = () => {
  const [formData, setFormData] = useState({
    coursecode: '',
    subjectname: '',
    department: '',
    semester: '',
    credits: '',
    description: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:2910/adminapi/addsubject', formData)
      setMessage(response.data)
      setError('')
      setFormData({ coursecode: '', subjectname: '', department: '', semester: '', credits: '', description: '' })
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
        <h2>Add Subject</h2>
        <p>Fill in the details below to add a new subject</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="admin-form-item">
            <label className="admin-form-label">Course Code</label>
            <input type="text" name="coursecode" placeholder="e.g. CS301" value={formData.coursecode} onChange={handleChange} required maxLength={20} />
          </div>
          <div className="admin-form-item">
            <label className="admin-form-label">Subject Name</label>
            <input type="text" name="subjectname" placeholder="e.g. Data Structures" value={formData.subjectname} onChange={handleChange} required maxLength={40} />
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
            <label className="admin-form-label">Semester</label>
            <select name="semester" value={formData.semester} onChange={handleChange} required>
              <option value="">Select Semester</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>
          <div className="admin-form-item">
            <label className="admin-form-label">Credits</label>
            <input type="number" name="credits" placeholder="e.g. 4" value={formData.credits} onChange={handleChange} required step="0.5" min="0" max="10" />
          </div>
          <div className="admin-form-item">
            <label className="admin-form-label">Description</label>
            <textarea name="description" placeholder="Enter subject description" value={formData.description} onChange={handleChange} maxLength={255} />
          </div>
          <button type="submit" className="admin-primary-btn">Add Subject</button>
        </div>
      </form>
      {message && <div className="admin-success">{message}</div>}
      {error && <div className="admin-error">{error}</div>}
    </div>
  )
}

export default AddSubject