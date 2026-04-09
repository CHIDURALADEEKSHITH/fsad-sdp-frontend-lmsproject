import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Student.css'

const ViewSubjects = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const getStudent = () => {
    try {
      return JSON.parse(sessionStorage.getItem('loggedInStudent')) || {}
    } catch {
      return {}
    }
  }

  const student = getStudent()

  useEffect(() => {
    if (!student?.department) {
      setError('Student session not found. Please log in again.')
      setLoading(false)
      return
    }
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`http://localhost:2910/studentapi/viewsubjectbydepartment?department=${student.department}`)
        setSubjects(response.data)
      } catch (err) {
        setError('Error fetching subjects')
      } finally {
        setLoading(false)
      }
    }
    fetchSubjects()
  }, [])

  return (
    <div>
      <div className="student-section-card">
        <div className="student-section-header">
          <h2>My Subjects</h2>
          <p>Click on a subject to view projects</p>
        </div>
        {error && <div className="student-error">{error}</div>}
        {loading ? (
          <p className="student-loading">Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <p className="student-loading">No subjects found for your department</p>
        ) : (
          <div className="student-subject-grid">
            {subjects.map((s) => (
              <div
                key={s.coursecode}
                className="student-subject-card"
                onClick={() => navigate(`/student/subjectprojects/${s.coursecode}`)}
              >
                <div className="student-subject-card-header">
                  <span className="student-subject-code">{s.coursecode}</span>
                </div>
                <span className="student-subject-name">{s.subjectname}</span>
                <div className="student-subject-details">
                  <span className="student-subject-info">Semester: {s.semester}</span>
                  <span className="student-subject-info">Credits: {s.credits}</span>
                </div>
                {s.description && <span className="student-subject-desc">{s.description}</span>}
                <span className="student-subject-view">View Projects →</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewSubjects