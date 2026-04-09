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

  const [members, setMembers] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState(null)

  const [joinedGroupId, setJoinedGroupId] = useState(student?.group?.id || null)

  const findJoinedGroupId = (groupsData) => {
    if (!student?.id) return null
    const studentId = student.id
    const matchedGroup = groupsData.find((g) => {
      const members = g.members || g.students || g.studentsList || []
      if (Array.isArray(members) && members.some((m) => m?.id === studentId || m?.studentId === studentId)) {
        return true
      }
      if (g.leader?.id === studentId) return true
      return false
    })
    return matchedGroup ? matchedGroup.id : null
  }

  const fetchGroups = async () => {
    try {
      const response = await axios.get(
        `http://localhost:2910/studentapi/viewgroupsbyproject?projectId=${projectId}`
      )
      const groupsData = Array.isArray(response.data) ? response.data : []
      setGroups(groupsData)

      const detectedGroupId = findJoinedGroupId(groupsData)
      if (detectedGroupId && detectedGroupId !== joinedGroupId) {
        setJoinedGroupId(detectedGroupId)
        sessionStorage.setItem(
          'loggedInStudent',
          JSON.stringify({ ...student, group: { id: detectedGroupId } })
        )
      }
    } catch (err) {
      setError('Error fetching groups')
    } finally {
      setLoading(false)
    }
  }

  const fetchMembers = async (groupId) => {
    try {
      const response = await axios.get(
        'http://localhost:2910/studentapi/viewmembersbygroup',
        { params: { groupId } }
      )
      setMembers(response.data)
    } catch (err) {
      setError('Error fetching members')
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  const handleJoinGroup = async (groupId) => {
    if (joinedGroupId) {
      setError('You have already joined a group. You cannot join another group.')
      return
    }

    try {
      const response = await axios.post(
        `http://localhost:2910/studentapi/joingroup?groupId=${groupId}&studentId=${student?.id}`
      )

      setMessage(response.data)
      setError('')

      // ✅ update state instantly
      setJoinedGroupId(groupId)

      // ✅ update session (important)
      const updatedStudent = { ...student, group: { id: groupId } }
      sessionStorage.setItem('loggedInStudent', JSON.stringify(updatedStudent))

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
              <div
                key={g.id}
                className="student-group-card"
                onClick={() => {
                  setSelectedGroupId(g.id)
                  fetchMembers(g.id)
                }}
              >
                <div className="student-group-card-header">
                  <span className="student-group-name">
                    Group {index + 1}
                  </span>
                  <span className="student-group-badge">
                    Max: {g.maxMembers}
                  </span>
                </div>

                <span className="student-group-info">
                  Leader: {g.leader ? g.leader.name : 'Not Assigned'}
                </span>
                {joinedGroupId === g.id ? (
                  <button className="student-join-btn" disabled>
                    Already Joined
                  </button>
                ) : (
                  <button
                    className="student-join-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleJoinGroup(g.id)
                    }}
                  >
                    Join Group
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      
      {selectedGroupId && (
        <div className="student-section-card">
          <div className="student-section-header">
            <h2>
              Group {groups.findIndex(g => g.id === selectedGroupId) + 1} Members
            </h2>
            <p>
              Members in Group {groups.findIndex(g => g.id === selectedGroupId) + 1}
            </p>
          </div>

          {members.length === 0 ? (
            <p className="student-loading">
              No members in this group yet
            </p>
          ) : (
            <div className="student-members-list">
              {members.map((member) => (
                <div key={member.id} className="student-member-item">
                  <span className="student-member-id">
                    ID: {member.id}
                  </span>
                  <span className="student-member-name">
                    {member.name}
                  </span>
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