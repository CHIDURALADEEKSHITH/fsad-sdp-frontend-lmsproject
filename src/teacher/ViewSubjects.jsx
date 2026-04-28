import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Teacher.css'

const ViewSubjects = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const teacher = JSON.parse(sessionStorage.getItem('loggedInTeacher'))
//
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(`/teacherapi/viewsubjectbydepartment?department=${teacher?.department}`)
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
      <div className="teacher-section-card">
        <div className="teacher-section-header">
          <h2>My Subjects</h2>
          <p>Click on a subject to view projects</p>
        </div>
        {error && <div className="teacher-error">{error}</div>}
        {loading ? (
          <p className="teacher-loading">Loading subjects...</p>
        ) : subjects.length === 0 ? (
          <p className="teacher-loading">No subjects found for your department</p>
        ) : (
          <div className="teacher-subject-grid">
            {subjects.map((s) => (
              <div
                key={s.coursecode}
                className="teacher-subject-card"
                onClick={() => navigate(`/teacher/subjectprojects/${s.coursecode}`)}
              >
                <div className="teacher-subject-card-header">
                  <span className="teacher-subject-code">{s.coursecode}</span>
                </div>
                <span className="teacher-subject-name">{s.subjectname}</span>
                <div className="teacher-subject-details">
                  <span className="teacher-subject-info">Semester: {s.semester}</span>
                  <span className="teacher-subject-info">Credits: {s.credits}</span>
                </div>
                {s.description && <span className="teacher-subject-desc">{s.description}</span>}
                <span className="teacher-subject-view">View Projects →</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewSubjects

