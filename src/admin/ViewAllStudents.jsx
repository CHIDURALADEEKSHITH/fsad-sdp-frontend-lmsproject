import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Admin.css'

const ViewAllStudents = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:2910/adminapi/viewallstudents')
      setStudents(response.data)
    } catch (err) {
      setError('Error fetching students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStudents() }, [])

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/adminapi/deletestudent/${id}`)
      setMessage('Student deleted successfully')
      setError('')
      fetchStudents()
    } catch (err) {
      setError('Error deleting student')
    }
  }

  return (
    <div className="admin-section-card">
      <div className="admin-section-header">
        <h2>All Students</h2>
        <p>View and manage all registered students</p>
      </div>
      <div className="admin-search-row">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Search students by name, email, or department"
          aria-label="Search students"
        />
      </div>
      {message && <div className="admin-success">{message}</div>}
      {error && <div className="admin-error">{error}</div>}
      {loading ? (
        <p className="admin-loading">Loading students...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Username</th>
                <th>Department</th>
                <th>Blood Group</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan="9" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>No students found</td></tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.name}</td>
                    <td>{s.gender}</td>
                    <td>{s.email}</td>
                    <td>{s.contact}</td>
                    <td>{s.username}</td>
                    <td>{s.department}</td>
                    <td>{s.bloodgroup}</td>
                    <td>
                      <button className="admin-danger-btn" onClick={() => handleDelete(s.id)}>Delete</button>
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

export default ViewAllStudents

