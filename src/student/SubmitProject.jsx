import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { API_BASE_URL } from '../config/api'
import './Student.css'

const SubmitProject = () => {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const student = JSON.parse(sessionStorage.getItem('loggedInStudent'))
  
  const [isLeader, setIsLeader] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [file, setFile] = useState(null)
  const [description, setDescription] = useState('')

  useEffect(() => {
    checkLeaderStatus()
  }, [groupId])

  const checkLeaderStatus = async () => {
    try {
      const response = await axios.get(`/studentapi/isgroupleader?studentId=${student.id}&groupId=${groupId}`)
      setIsLeader(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to check leader status')
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Limit file size to 50MB
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB')
        return
      }
      setFile(selectedFile)
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please select a file to upload')
      return
    }

    setSubmitting(true)
    setError('')
    setMessage('')

    try {
      // Create form data for file upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('fileName', file.name)
      formData.append('filePath', `/uploads/${file.name}`)
      formData.append('contentType', file.type)
      formData.append('fileSize', file.size)
      formData.append('description', description)
      formData.append('groupId', groupId)
      formData.append('studentId', student.id)

      const response = await axios.post(`${API_BASE_URL}/studentapi/submitproject`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        params: {
          groupId: parseInt(groupId),
          studentId: student.id
        },
        data: {
          fileName: file.name,
          filePath: `/uploads/${file.name}`,
          contentType: file.type,
          fileSize: file.size,
          description: description
        }
      })

      setMessage(response.data)
      setFile(null)
      setDescription('')
    } catch (err) {
      if (err.response?.data) {
        setError(err.response.data)
      } else if (err.request) {
        setError('Network Error - Server not responding')
      } else {
        setError('Failed to submit project')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="loading-container">Loading...</div>
  }

  if (!isLeader) {
    return (
      <div className="submit-project-container">
        <div className="access-denied-card">
          <h2>Access Denied</h2>
          <p>Only the group leader can submit the project.</p>
          <button onClick={() => navigate(-1)} className="student-primary-btn">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="submit-project-container">
      <div className="submit-project-card">
        <h2>Submit Project</h2>
        <p className="submit-project-subtitle">Upload your project files</p>

        {message && <div className="form-message form-message-success">{message}</div>}
        {error && <div className="form-message form-message-error">{error}</div>}

        <form onSubmit={handleSubmit} className="submit-project-form">
          <div className="form-group">
            <label>Project File</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".zip,.rar,.pdf,.doc,.docx,.ppt,.pptx,.txt"
                className="file-input"
              />
              {file && (
                <div className="selected-file">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}
            </div>
            <small className="file-hint">Accepted formats: ZIP, RAR, PDF, DOC, PPT, TXT (Max 50MB)</small>
          </div>

          <div className="form-group">
            <label>Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a brief description of your submission..."
              rows={4}
              maxLength={1000}
            />
          </div>

          <button type="submit" className="student-primary-btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Project'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SubmitProject

