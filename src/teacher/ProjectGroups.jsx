import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './Teacher.css'

const ProjectGroups = () => {
  const { projectId } = useParams()
  const teacher = JSON.parse(sessionStorage.getItem('loggedInTeacher'))

  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [maxMembers, setMaxMembers] = useState(3)

  const [members, setMembers] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [errorMembers, setErrorMembers] = useState('')

  const [submissions, setSubmissions] = useState([])
  const [loadingSubmissions, setLoadingSubmissions] = useState(false)
  const [showSubmissions, setShowSubmissions] = useState(false)

  const [evaluatingSubmission, setEvaluatingSubmission] = useState(null)
  const [marks, setMarks] = useState('')
  const [feedback, setFeedback] = useState('')
  const [evaluating, setEvaluating] = useState(false)

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://localhost:2910/teacherapi/viewgroupsbyproject', {
        params: { projectId }
      })
      setGroups(Array.isArray(response.data) ? response.data : [])
      setError('')
    } catch (err) {
      setError('Error fetching groups')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setGroups([])
    setLoading(true)
    setError('')
    fetchGroups()
  }, [projectId])

  const handleCreateGroup = async () => {
    try {
      const response = await axios.post('http://localhost:2910/teacherapi/creategroup', null, {
        params: { projectId, maxMembers }
      })
      setMessage(response.data)
      setError('')
      fetchGroups()
    } catch (err) {
      setError('Error creating group')
    }
  }

  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete('http://localhost:2910/teacherapi/deletegroup', {
        params: { groupId }
      })
      setMessage('Group Deleted Successfully')
      setError('')
      fetchGroups()
    } catch (err) {
      setError('Error deleting group')
    }
  }

  const handleGroupClick = async (groupId) => {
    setSelectedGroupId(groupId)
    setShowSubmissions(false)
    setLoadingMembers(true)
    setErrorMembers('')

    try {
      const response = await axios.get('http://localhost:2910/teacherapi/viewmembersbygroup', {
        params: { groupId }
      })
      setMembers(response.data || [])
    } catch (err) {
      setErrorMembers('Error fetching members')
      setMembers([])
    } finally {
      setLoadingMembers(false)
    }
  }

  const handleAssignLeader = async (groupId, studentId) => {
    try {
      const response = await axios.post('http://localhost:2910/teacherapi/assignleader', null, {
        params: { groupId, studentId }
      })

      setMessage(response.data)
      setError('')

      await fetchGroups()

      if (selectedGroupId === groupId) {
        handleGroupClick(groupId)
      }
    } catch (err) {
      setError(err.response?.data || 'Error assigning leader')
      setMessage('')
    }
  }

  const handleViewSubmissions = async (groupId) => {
    setSelectedGroupId(groupId)
    setLoadingSubmissions(true)
    setShowSubmissions(true)

    try {
      const response = await axios.get('http://localhost:2910/studentapi/viewsubmissionsbygroup', {
        params: { groupId }
      })
      setSubmissions(response.data || [])
    } catch (err) {
      setError('Error fetching submissions')
      setSubmissions([])
    } finally {
      setLoadingSubmissions(false)
    }
  }

  const downloadSubmission = async (submissionId, fileName) => {
    try {
      const response = await axios.get('http://localhost:2910/teacherapi/downloadsubmission', {
        params: { submissionId },
        responseType: 'blob'
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      alert('Error downloading file')
    }
  }

  const handleEvaluateClick = (submission) => {
    setEvaluatingSubmission(submission)
    setMarks(submission.marks || '')
    setFeedback(submission.feedback || '')
  }

  const handleSubmitEvaluation = async () => {
    if (!marks) {
      alert('Please enter marks')
      return
    }

    setEvaluating(true)

    try {
      const response = await axios.post('http://localhost:2910/teacherapi/evaluatesubmission', null, {
        params: {
          submissionId: evaluatingSubmission.id,
          marks: parseInt(marks),
          feedback,
          teacherId: teacher.id
        }
      })

      alert(response.data)
      setEvaluatingSubmission(null)
      setMarks('')
      setFeedback('')

      const subResponse = await axios.get('http://localhost:2910/studentapi/viewsubmissionsbygroup', {
        params: { groupId: selectedGroupId }
      })
      setSubmissions(subResponse.data || [])
    } catch (err) {
      alert('Error evaluating submission')
    } finally {
      setEvaluating(false)
    }
  }

  return (
    <div>
      <div className="teacher-section-card">
        <div className="teacher-section-header">
          <h2>Manage Groups</h2>
          <p>Create and manage groups for this project</p>
        </div>

        <div className="teacher-create-group">
          <div className="teacher-form-item">
            <label className="teacher-form-label">Max Members per Group</label>
            <input
              type="number"
              min="1"
              max="10"
              value={maxMembers}
              onChange={(e) => setMaxMembers(e.target.value)}
              style={{ width: '100px' }}
            />
          </div>

          <button
            className="teacher-primary-btn"
            style={{ width: 'auto', padding: '10px 24px', marginTop: '10px' }}
            onClick={handleCreateGroup}
          >
            Create Group
          </button>
        </div>

        {message && <div className="teacher-success">{message}</div>}
        {error && <div className="teacher-error">{error}</div>}
      </div>

      <div className="teacher-section-card">
        <div className="teacher-section-header">
          <h2>All Groups</h2>
          <p>View and manage all groups for this project</p>
        </div>

        {loading ? (
          <p className="teacher-loading">Loading groups...</p>
        ) : groups.length === 0 ? (
          <p className="teacher-loading">No groups created yet</p>
        ) : (
          <div className="teacher-group-grid">
            {groups.map((g, index) => (
              <div
                key={g.id}
                className="teacher-group-card"
                onClick={() => handleGroupClick(g.id)}
              >
                <div className="teacher-group-card-header">
                  <span className="teacher-group-name">Group {index + 1}</span>
                  <button
                    className="teacher-danger-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteGroup(g.id)
                    }}
                  >
                    Delete
                  </button>
                </div>

                <span className="teacher-group-info">
                  Max Members: {g.maxMembers}
                </span>

                <span className="teacher-group-info">
                  Leader: {g.leader ? g.leader.name : 'Not Assigned'}
                </span>

                <div className="teacher-assign-leader">
                  <select
                    className="teacher-group-select"
                    value={g.leader ? g.leader.id : ''}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAssignLeader(g.id, parseInt(e.target.value))
                      }
                    }}
                  >
                    <option value="">Assign Leader</option>
                    {g.members && g.members.length > 0 ? (
                      g.members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No members</option>
                    )}
                  </select>
                </div>

                <button
                  className="teacher-secondary-btn"
                  style={{ marginTop: '10px', width: '100%' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewSubmissions(g.id)
                  }}
                >
                  View Submissions
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedGroupId && !showSubmissions && (
        <div className="teacher-section-card">
          <div className="teacher-section-header">
            <h2>
              Group {groups.findIndex(g => g.id === selectedGroupId) + 1} Members
            </h2>
            <p>
              Members in Group {groups.findIndex(g => g.id === selectedGroupId) + 1}
            </p>
          </div>

          {errorMembers && <div className="teacher-error">{errorMembers}</div>}

          {loadingMembers ? (
            <p className="teacher-loading">Loading members...</p>
          ) : members.length === 0 ? (
            <p className="teacher-loading">
              No members in Group {groups.findIndex(g => g.id === selectedGroupId) + 1}
            </p>
          ) : (
            <div className="teacher-members-list">
              {members.map((student) => (
                <div key={student.id} className="teacher-member-item">
                  <span className="teacher-member-name">{student.name}</span>
                  <span className="teacher-member-id">ID: {student.id}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showSubmissions && (
        <div className="teacher-section-card">
          <div className="teacher-section-header">
            <h2>Submissions</h2>
            <button
              className="teacher-secondary-btn"
              onClick={() => setShowSubmissions(false)}
              style={{ width: 'auto', padding: '8px 16px' }}
            >
              Back to Groups
            </button>
          </div>

          {loadingSubmissions ? (
            <p className="teacher-loading">Loading submissions...</p>
          ) : submissions.length === 0 ? (
            <p className="teacher-loading">No submissions yet for this group</p>
          ) : (
            <div className="teacher-submissions-list">
              {submissions.map((submission) => (
                <div key={submission.id} className="teacher-submission-card">
                  <div className="teacher-submission-header">
                    <span className="teacher-submission-file">
                      {submission.fileName}
                    </span>
                    <span className="teacher-submission-date">
                      Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="teacher-submission-details">
                    <span>By: {submission.submittedBy?.name || 'Unknown'}</span>
                    {submission.description && (
                      <span>Description: {submission.description}</span>
                    )}
                  </div>

                  {submission.marks !== null && submission.marks !== undefined && (
                    <div className="teacher-submission-marks">
                      <span className="teacher-marks-badge">
                        Marks: {submission.marks}
                      </span>
                      {submission.feedback && (
                        <span className="teacher-feedback">
                          Feedback: {submission.feedback}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="teacher-submission-actions">
                    <button
                      className="teacher-primary-btn"
                      onClick={() => downloadSubmission(submission.id, submission.fileName)}
                    >
                      Download PDF
                    </button>

                    <button
                      className="teacher-secondary-btn"
                      onClick={() => handleEvaluateClick(submission)}
                    >
                      Evaluate
                    </button>
                  </div>

                  {evaluatingSubmission && evaluatingSubmission.id === submission.id && (
                    <div className="teacher-evaluation-form">
                      <h4>Evaluate Submission</h4>

                      <div className="teacher-form-item">
                        <label className="teacher-form-label">Marks (0-100)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={marks}
                          onChange={(e) => setMarks(e.target.value)}
                        />
                      </div>

                      <div className="teacher-form-item">
                        <label className="teacher-form-label">Feedback</label>
                        <textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Enter feedback..."
                          rows="3"
                        />
                      </div>

                      <div className="teacher-form-actions">
                        <button
                          className="teacher-primary-btn"
                          onClick={handleSubmitEvaluation}
                          disabled={evaluating}
                        >
                          {evaluating ? 'Saving...' : 'Save Evaluation'}
                        </button>

                        <button
                          className="teacher-secondary-btn"
                          onClick={() => setEvaluatingSubmission(null)}
                          disabled={evaluating}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProjectGroups