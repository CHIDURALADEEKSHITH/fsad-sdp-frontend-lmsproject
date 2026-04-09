import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Admin.css'

const ViewAllTeachers = () => {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const fetchTeachers = async () => {
    try {
      const response = await axios.get('http://localhost:2910/adminapi/viewallteachers')
      setTeachers(response.data)
    } catch (err) {
      setError('Error fetching teachers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTeachers() }, [])

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:2910/adminapi/deleteteacher/${id}`)
      setMessage('Teacher deleted successfully')
      setError('')
      fetchTeachers()
    } catch (err) {
      setError('Error deleting teacher')
    }
  }

  return (
    <div className="admin-section-card">
      <div className="admin-section-header">
        <h2>All Teachers</h2>
        <p>View and manage all registered teachers</p>
      </div>
      <div className="admin-search-row">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search teachers by name, email, or department"
          aria-label="Search teachers"
        />
      </div>
      {message && <div className="admin-success">{message}</div>}
      {error && <div className="admin-error">{error}</div>}
      {loading ? (
        <p className="admin-loading">Loading teachers...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Username</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Designation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teachers.length === 0 ? (
                <tr><td colSpan="8" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>No teachers found</td></tr>
              ) : (
                teachers.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.name}</td>
                    <td>{t.department}</td>
                    <td>{t.username}</td>
                    <td>{t.email}</td>
                    <td>{t.contact}</td>
                    <td>{t.designation}</td>
                    <td>
                      <button className="admin-danger-btn" onClick={() => handleDelete(t.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ViewAllTeachers
