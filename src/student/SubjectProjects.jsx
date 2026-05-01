import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
import './Student.css'

const SubjectProjects = () => {
  const { coursecode } = useParams()
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await axios.get(`${API_BASE_URL}/studentapi/viewprojectsbysubject`, {
          params: { coursecode }
        })
        setProjects(response.data)
      } catch (err) {
        setError('Error fetching projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [coursecode])

  const downloadProjectFile = (projectId, e) => {
    e.stopPropagation()
    window.open(`${API}/teacherapi/downloadprojectfile?projectId=${projectId}`, '_blank')
  }

  return (
    <div>
      <div className="student-section-card">
        <div className="student-section-header">
          <h2>Projects — {coursecode}</h2>
          <p>Click on a project to view groups</p>
        </div>

        {error && <div className="student-error">{error}</div>}

        {loading ? (
          <p className="student-loading">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="student-loading">No projects found for this subject</p>
        ) : (
          <div className="student-project-grid">
            {projects.map((p) => (
              <div
                key={p.id}
                className="student-project-card"
                onClick={() => navigate(`/student/projectgroups/${p.id}`)}
              >
                <span className="student-project-title">{p.title}</span>
                <span className="student-project-desc">{p.description}</span>
                <span className="student-project-deadline">Deadline: {p.deadline}</span>

                {p.fileName && (
                  <button
                    className="student-secondary-btn"
                    onClick={(e) => downloadProjectFile(p.id, e)}
                  >
                    Download Project File
                  </button>
                )}

                <span className="student-subject-view">View Groups →</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SubjectProjects