import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './Student.css'

const ProjectGroups = () => {
  const { projectId } = useParams()
  const student = JSON.parse(sessionStorage.getItem('loggedInStudent'))

  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`http://localhost:2910/studentapi/viewgroupsbyproject?projectId=${projectId}`)
      const groupsData = Array.isArray(response.data) ? response.data : []
      setGroups(groupsData)
    } catch (err) {
      setError('Error fetching groups')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGroups() }, [])

  const handleJoinGroup = async (groupId) => {
    try {
      const response = await axios.post(`http://localhost:2910/studentapi/joingroup?groupId=${groupId}&studentId=${student?.id}`)
      setMessage(response.data)
      setError('')
      fetchGroups()
    } catch (err) {
      setError('Error joining group')
    }
  }

  return (
    <div>
      <div className="student-section-card">
        <div className="student-section-header">
          <h2>Available Groups</h2>
          <p>Join a group for this project</p>
        </div>
        {message && <div className="student-success">{message}</div>}
        {error && <div className="student-error">{error}</div>}
        {loading ? (
          <p className="student-loading">Loading groups...</p>
        ) : groups.length === 0 ? (
          <p className="student-loading">No groups available yet</p>
        ) : (
          <div className="student-group-grid">
            {groups.map((g, index) => (
              <div key={g.id} className="student-group-card">
                <div className="student-group-card-header">
                  <span className="student-group-name">Group {index + 1}</span>
                  <span className="student-group-badge">Max: {g.maxMembers}</span>
                </div>
                <span className="student-group-info">
                  Leader: {g.leader ? g.leader.name : 'Not Assigned'}
                </span>
                <button
                  className="student-join-btn"
                  onClick={() => handleJoinGroup(g.id)}
                >
                  Join Group
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectGroups