import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Student.css'

const MyGroups = () => {
  const student = JSON.parse(sessionStorage.getItem('loggedInStudent'))
  const navigate = useNavigate()
  
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyGroups()
  }, [])

  const fetchMyGroups = async () => {
    try {
      const response = await axios.get(`/studentapi/mygroups?studentId=${student.id}`)
      setGroups(response.data)
    } catch (err) {
      setError('Error fetching your groups')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading-container">Loading your groups...</div>
  }

  return (
    <div>
      <div className="student-section-card">
        <div className="student-section-header">
          <h2>My Groups</h2>
          <p>All project groups you have joined</p>
        </div>

        {error && <div className="student-error">{error}</div>}

        {groups.length === 0 ? (
          <div className="empty-state">
            <p>You haven't joined any group yet.</p>
            <Link to="/student/viewsubjects">
              <button className="student-primary-btn">Browse Subjects</button>
            </Link>
          </div>
        ) : (
          <div className="student-group-grid">
            {groups.map((group) => (
              <div key={group.id} className="student-group-card">

                <div className="student-group-card-header">
                  <span className="student-group-name">
                    {group.project?.title || 'Project'}
                  </span>
                  <span className="student-group-badge">
                    {group.project?.subject?.subjectname || group.project?.subject?.coursecode}
                  </span>
                </div>

                <div className="group-details">
                  <span className="student-group-info">
                    Subject: {group.project?.subject?.subjectname}
                  </span>

                  <span className="student-group-info">
                    Leader: {group.leader?.name || 'Not Assigned'}
                  </span>

                  <span className="student-group-info">
                    Members: {group.members?.length || 0}/{group.maxMembers}
                  </span>
                </div>

                <div className="group-actions">
                  <button 
                    className="student-secondary-btn"
                    onClick={() => navigate(`/student/viewsubmissions/${group.id}`)}
                  >
                    View Submissions
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyGroups