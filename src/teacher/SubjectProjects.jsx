import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Teacher.css'

const SubjectProjects = () => {
  const { coursecode } = useParams()
  const navigate = useNavigate()
  const teacher = JSON.parse(sessionStorage.getItem('loggedInTeacher'))

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: ''
  })//

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`http://localhost:2910/teacherapi/viewprojectsbysubject?coursecode=${coursecode}`)
      setProjects(response.data)
    } catch (err) {
      setError('Error fetching projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `http://localhost:2910/teacherapi/addproject?coursecode=${coursecode}&teacherId=${teacher?.id}`,
        formData
      )
      setMessage(response.data)
      setError('')
      setFormData({ title: '', description: '', deadline: '' })
      fetchProjects()
    } catch (err) {
      setError('Error adding project')
    }
  }

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(`http://localhost:2910/teacherapi/deleteproject?projectId=${projectId}`)
      setMessage('Project Deleted Successfully')
      fetchProjects()
    } catch (err) {
      setError('Error deleting project')
    }
  }

  return (
    <div>
      <div className="teacher-section-card">
        <div className="teacher-section-header">
          <h2>Projects — {coursecode}</h2>
          <p>Manage projects for this subject</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="teacher-form-grid">
            <div className="teacher-form-item">
              <label className="teacher-form-label">Title</label>
              <input type="text" name="title" placeholder="Enter project title" value={formData.title} onChange={handleChange} required maxLength={100} />
            </div>
            <div className="teacher-form-item">
              <label className="teacher-form-label">Deadline</label>
              <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />
            </div>
            <div className="teacher-form-item" style={{ gridColumn: '1 / -1' }}>
              <label className="teacher-form-label">Description</label>
              <input type="text" name="description" placeholder="Enter project description" value={formData.description} onChange={handleChange} required maxLength={255} />
            </div>
            <button type="submit" className="teacher-primary-btn">Add Project</button>
          </div>
        </form>
        {message && <div className="teacher-success">{message}</div>}
        {error && <div className="teacher-error">{error}</div>}
      </div>

      <div className="teacher-section-card">
        <div className="teacher-section-header">
          <h2>All Projects</h2>
          <p>Click on a project to manage groups</p>
        </div>
        {loading ? (
          <p className="teacher-loading">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="teacher-loading">No projects found for this subject</p>
        ) : (
          <div className="teacher-project-grid">
            {projects.map((p) => (
              <div key={p.id} className="teacher-project-card">
                <div className="teacher-project-card-header">
                  <span className="teacher-project-title">{p.title}</span>
                  <button className="teacher-danger-btn" onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
                <span className="teacher-project-desc">{p.description}</span>
                <span className="teacher-project-deadline">Deadline: {p.deadline}</span>
                <button
                  className="teacher-view-btn"
                  onClick={() => navigate(`/teacher/projectgroups/${p.id}`)}
                >
                  Manage Groups →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SubjectProjects