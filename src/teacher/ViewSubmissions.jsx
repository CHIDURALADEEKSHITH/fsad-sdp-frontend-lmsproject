import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import './Teacher.css'

const ViewSubmissions = () => {
  const { projectId } = useParams()
  const teacher = JSON.parse(sessionStorage.getItem('loggedInTeacher'))
  
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [evaluatingId, setEvaluatingId] = useState(null)
  const [marks, setMarks] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    fetchSubmissions()
  }, [projectId])

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get(`/teacherapi/viewsubmissionsbyproject?projectId=${projectId}`)
      setSubmissions(response.data)
      setLoading(false)
    } catch (err) {
      setError('Failed to load submissions')
      setLoading(false)
    }
  }

  const handleEvaluate = (submissionId) => {
    setEvaluatingId(submissionId)
    const submission = submissions.find(s => s.id === submissionId)
    if (submission) {
      setMarks(submission.marks || '')
      setFeedback(submission.feedback || '')
    }
  }

  const handleCancelEvaluate = () => {
    setEvaluatingId(null)
    setMarks('')
    setFeedback('')
    setSuccess('')
  }

  const handleSubmitEvaluation = async (submissionId) => {
    if (marks === '' || marks < 0 || marks > 100) {
      setError('Please enter valid marks (0-100)')
      return
    }

    try {
      const response = await axios.post(
        `/teacherapi/evaluatesubmission?submissionId=${submissionId}&marks=${marks}&feedback=${encodeURIComponent(feedback)}&teacherId=${teacher.id}`
      )
      setSuccess(response.data)
      setError('')
      setEvaluatingId(null)
      setMarks('')
      setFeedback('')
      fetchSubmissions()
    } catch (err) {
      setError('Failed to evaluate submission')
      setSuccess('')
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
    <div className="teacher-submissions-container">
      <div className="teacher-submissions-card">
        <h2>Project Submissions</h2>
        <p className="teacher-submissions-subtitle">Review and evaluate student submissions</p>

        {error && <div className="form-message form-message-error">{error}</div>}
        {success && <div className="form-message form-message-success">{success}</div>}

        {submissions.length === 0 ? (
          <div className="empty-state">
            <p>No submissions yet for this project.</p>
          </div>
        ) : (
          <div className="submissions-list">
            {submissions.map((submission) => (
              <div key={submission.id} className="teacher-submission-item">
                <div className="submission-header">
                  <div className="submission-info">
                    <h3>{submission.fileName}</h3>
                    <span className="submission-group">
                      Group: {submission.projectGroup?.groupName || 'N/A'}
                    </span>
                  </div>
                  <span className="submission-date">
                    {formatDate(submission.submittedAt)}
                  </span>
                </div>
                
                <div className="submission-details">
                  <div className="detail-row">
                    <span className="detail-label">File Size:</span>
                    <span className="detail-value">{formatFileSize(submission.fileSize)}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">Submitted By:</span>
                    <span className="detail-value">{submission.submittedBy?.name || 'Unknown'}</span>
                  </div>
                  
                  {submission.description && (
                    <div className="detail-row">
                      <span className="detail-label">Description:</span>
                      <span className="detail-value">{submission.description}</span>
                    </div>
                  )}
                </div>

                <div className="submission-evaluation">
                  {evaluatingId === submission.id ? (
                    <div className="evaluation-form">
                      <div className="form-group">
                        <label>Marks (0-100)</label>
                        <input
                          type="number"
                          value={marks}
                          onChange={(e) => setMarks(e.target.value)}
                          min="0"
                          max="100"
                          placeholder="Enter marks"
                        />
                      </div>
                      <div className="form-group">
                        <label>Feedback</label>
                        <textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Enter feedback..."
                          rows={3}
                        />
                      </div>
                      <div className="evaluation-actions">
                        <button 
                          onClick={() => handleSubmitEvaluation(submission.id)}
                          className="teacher-primary-btn"
                        >
                          Submit Evaluation
                        </button>
                        <button 
                          onClick={handleCancelEvaluate}
                          className="teacher-secondary-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="evaluation-display">
                      {submission.marks !== null && submission.marks !== undefined ? (
                        <>
                          <div className="marks-badge-large">
                            <span className="marks-label">Marks:</span>
                            <span className="marks-value">{submission.marks}/100</span>
                          </div>
                          {submission.feedback && (
                            <div className="feedback-display">
                              <span className="feedback-label">Feedback:</span>
                              <p className="feedback-text">{submission.feedback}</p>
                            </div>
                          )}
                          {submission.evaluatedBy && (
                            <span className="evaluated-info">
                              Evaluated by: {submission.evaluatedBy.name}
                            </span>
                          )}
                        </>
                      ) : (
                        <button 
                          onClick={() => handleEvaluate(submission.id)}
                          className="teacher-primary-btn"
                        >
                          Evaluate
                        </button>
                      )}
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

