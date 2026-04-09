import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './Teacher.css'

const ProjectGroups = () => {
  const { projectId } = useParams()

  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [maxMembers, setMaxMembers] = useState(3)

  const [members, setMembers] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [errorMembers, setErrorMembers] = useState('')

  const fetchGroups = async () => {
    try {
      const response = await axios.get(`http://localhost:2910/teacherapi/viewgroupsbyproject?projectId=${projectId}`)
      const groupsData = Array.isArray(response.data) ? response.data : []
      setGroups(groupsData)
    } catch (err) {
      setError('Error fetching groups')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGroups() }, [])

  const handleCreateGroup = async () => {
    try {
      const response = await axios.post(`http://localhost:2910/teacherapi/creategroup?projectId=${projectId}&maxMembers=${maxMembers}`)
      setMessage(response.data)
      setError('')
      fetchGroups()
    } catch (err) {
      setError('Error creating group')
    }
  }

  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete(`http://localhost:2910/teacherapi/deletegroup?groupId=${groupId}`)
      setMessage('Group Deleted Successfully')
      setError('')
      fetchGroups()
    } catch (err) {
      setError('Error deleting group')
    }
  }

  const handleGroupClick = async (groupId) => {
    setSelectedGroupId(groupId)
    setLoadingMembers(true)
    setErrorMembers('')
    try {
      const response = await axios.get('http://localhost:2910/teacherapi/viewmembersbygroup', {
        params: { groupId }
      })
      setMembers(response.data)
    } catch (err) {
      setErrorMembers('Error fetching members')
    } finally {
      setLoadingMembers(false)
    }
  }

  const handleAssignLeader = async (groupId, studentId) => {
    try {
      const response = await axios.post(`http://localhost:2910/teacherapi/assignleader?groupId=${groupId}&studentId=${studentId}`)
      setMessage(response.data)
      setError('')
      fetchGroups()
    } catch (err) {
      setError('Error assigning leader')
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
              <div key={g.id} className="teacher-group-card" onClick={() => handleGroupClick(g.id)}>
                <div className="teacher-group-card-header">
                  <span className="teacher-group-name">Group {index + 1}</span>
                  <button className="teacher-danger-btn" onClick={(e) => { e.stopPropagation(); handleDeleteGroup(g.id); }}>Delete</button>
                </div>
                <span className="teacher-group-info">Max Members: {g.maxMembers}</span>
                <span className="teacher-group-info">
                  Leader: {g.leader ? g.leader.name : 'Not Assigned'}
                </span>
                <div className="teacher-assign-leader">
                  <select
                    className="teacher-group-select"
                    onChange={(e) => handleAssignLeader(g.id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Assign Leader</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedGroupId && (
        <div className="teacher-section-card">
          <div className="teacher-section-header">
            <h2>Group {groups.findIndex(g => g.id === selectedGroupId) + 1} Members</h2>
            <p>Members in Group {groups.findIndex(g => g.id === selectedGroupId) + 1}</p>
          </div>
          {errorMembers && <div className="teacher-error">{errorMembers}</div>}
          {loadingMembers ? (
            <p className="teacher-loading">Loading members...</p>
          ) : members.length === 0 ? (
            <p className="teacher-loading">No members in Group {groups.findIndex(g => g.id === selectedGroupId) + 1}</p>
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
    </div>
  )
}

export default ProjectGroups