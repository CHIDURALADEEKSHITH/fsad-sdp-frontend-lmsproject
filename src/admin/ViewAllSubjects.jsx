import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Admin.css'

const ViewAllSubjects = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('http://localhost:2910/adminapi/viewallsubjects')
      setSubjects(response.data)
    } catch (err) {
      setError('Error fetching subjects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSubjects() }, [])

  const handleDelete = async (coursecode) => {
    try {
      await axios.delete(`http://localhost:2910/adminapi/deletesubject?coursecode=${coursecode}`)
      setMessage('Subject Deleted Successfully')
      setError('')
      fetchSubjects()
    } catch (err) {
      setError('Error deleting subject')
    }
  }

  return (
    <div className="admin-section-card">
      <div className="admin-section-header">
        <h2>All Subjects</h2>
        <p>View and manage all registered subjects</p>
      </div>
      {message && <div className="admin-success">{message}</div>}
      {error && <div className="admin-error">{error}</div>}
      {loading ? (
        <p className="admin-loading">Loading subjects...</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Subject Name</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Credits</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {subjects.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>No subjects found</td></tr>
              ) : (
                subjects.map((s) => (
                  <tr key={s.coursecode}>
                    <td>{s.coursecode}</td>
                    <td>{s.subjectname}</td>
                    <td>{s.department}</td>
                    <td>{s.semester}</td>
                    <td>{s.credits}</td>
                    <td>{s.description}</td>
                    <td>
                      <button className="admin-danger-btn" onClick={() => handleDelete(s.coursecode)}>Delete</button>
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

export default ViewAllSubjects