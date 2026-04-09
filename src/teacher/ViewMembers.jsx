import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './Teacher.css'

const ViewMembers = () => {
  const { groupId } = useParams()
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:2910/teacherapi/viewmembersbygroup', {
          params: { groupId }
        })
        setStudents(response.data)
      } catch (err) {
        setError('Error fetching members')
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [groupId])

  return (
    <div>
      <div className="teacher-section-card">
        <div className="teacher-section-header">
          <h2>Group Members</h2>
          <p>Members in this group</p>
        </div>
        {error && <div className="teacher-error">{error}</div>}
        {loading ? (
          <p className="teacher-loading">Loading members...</p>
        ) : students.length === 0 ? (
          <p className="teacher-loading">No members in this group</p>
        ) : (
          <div className="teacher-members-list">
            {students.map((student) => (
              <div key={student.id} className="teacher-member-item">
                <span className="teacher-member-name">{student.name}</span>
                <span className="teacher-member-id">ID: {student.id}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewMembers