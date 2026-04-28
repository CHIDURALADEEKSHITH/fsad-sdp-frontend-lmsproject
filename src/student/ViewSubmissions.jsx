import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import './Student.css'

const ViewSubmissions = () => {
  const { groupId } = useParams()
  const student = JSON.parse(sessionStorage.getItem('loggedInStudent'))
  
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSubmissions()
  }, [groupId])

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`/studentapi/viewsubmissionsbygroup?groupId=${groupId}`)
      setSubmissions(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load submissions')
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '-'
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
  }

  if (loading) {
    return <div className="loading-container">Loading submissions...</div>
  }

  return (
    <div className="view-submissions-container">
      <div className="view-submissions-card">
        <h2>My Submissions</h2>
        <p className="view-submissions-subtitle">View your project submissions and marks</p>

        {error && <div className="form-message form-message-error">{error}</div>}

        {submissions.length === 0 ? (
          <div className="empty-state">
            <p>No submissions yet. Submit your project to see it here.</p>
          </div>
        ) : (
          <div className="submissions-list">
            {submissions.map((submission) => (
              <div key={submission.id} className="submission-item">
                <div className="submission-header">
                  <h3>{submission.fileName}</h3>
                  <span className="submission-date">
                    Submitted: {formatDate(submission.submittedAt)}
                  </span>
                </div>
                
                <div className="submission-details">
                  <div className="detail-row">
                    <span className="detail-label">File Size:</span>
                    <span className="detail-value">{formatFileSize(submission.fileSize)}</span>
                  </div>
                  
                  {submission.description && (
                    <div className="detail-row">
                      <span className="detail-label">Description:</span>
                      <span className="detail-value">{submission.description}</span>
                    </div>
                  )}
                  
                  <div className="detail-row">
                    <span className="detail-label">Submitted By:</span>
                    <span className="detail-value">{submission.submittedBy?.name || 'Unknown'}</span>
                  </div>
                </div>

                <div className="submission-marks">
                  <h4>Evaluation</h4>
                  {submission.marks !== null && submission.marks !== undefined ? (
                    <div className="marks-display">
                      <div className="marks-badge">
                        <span className="marks-label">Marks:</span>
                        <span className="marks-value">{submission.marks}</span>
                      </div>
                      {submission.feedback && (
                        <div className="feedback-display">
                          <span className="feedback-label">Feedback:</span>
                          <p className="feedback-text">{submission.feedback}</p>
                        </div>
                      )}
                      {submission.evaluatedAt && (
                        <span className="evaluated-date">
                          Evaluated on: {formatDate(submission.evaluatedAt)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="pending-evaluation">
                      <span className="pending-badge">Pending Evaluation</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewSubmissions

