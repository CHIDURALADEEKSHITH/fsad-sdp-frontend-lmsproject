import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { API_BASE_URL } from '../config/api'
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
  const [joinedGroupId, setJoinedGroupId] = useState(null)

  const [file, setFile] = useState(null)
  const [submission, setSubmission] = useState(null)

  // ---------------- FETCH GROUPS ----------------
  const fetchGroups = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/studentapi/viewgroupsbyproject`, {
        params: { projectId }
      })

      const groupsData = res.data || []
      setGroups(groupsData)

      const joined = groupsData.find(g =>
        g.members?.some(m => m.id === student.id)
      )

      setJoinedGroupId(joined?.id || null)

    } catch {
      setError('Error fetching groups')
    } finally {
      setLoading(false)
    }
  }

  // ---------------- FETCH MEMBERS ----------------
  const fetchMembers = async (groupId) => {
    try {
      const res = await axios.get(`${API}/studentapi/viewmembersbygroup`, {
        params: { groupId }
      })
      setMembers(res.data || [])
    } catch {
      setMembers([])
      setError('Error fetching members')
    }
  }

  // ---------------- FETCH SUBMISSION ----------------
  const fetchSubmission = async (groupId) => {
    try {
      const res = await axios.get(`${API}/studentapi/viewsubmissionsbygroup`, {
        params: { groupId }
      })

      if (res.data.length > 0) {
        setSubmission(res.data[0])
      } else {
        setSubmission(null)
      }
    } catch {
      setSubmission(null)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [projectId])

  // ---------------- JOIN GROUP ----------------
  const handleJoinGroup = async (groupId) => {
    try {
      const res = await axios.post(`${API}/studentapi/joingroup`, null, {
        params: { groupId, studentId: student.id }
      })

      setMessage(res.data)
      setError('')
      fetchGroups()

    } catch (err) {
      setError(err.response?.data || 'Error joining group')
    }
  }

  // ---------------- UPLOAD PDF ----------------
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file")
      return
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("groupId", selectedGroupId)
    formData.append("studentId", student.id)

    try {
      await axios.post(`${API}/studentapi/uploadpdf`, formData)
      alert("Uploaded Successfully")
      fetchSubmission(selectedGroupId)
    } catch {
      alert("Upload failed")
    }
  }

  return (
    <div>

      {/* GROUP LIST */}
      <div className="student-section-card">
        <h2>Available Groups</h2>

        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          groups.map((g, index) => (
            <div
              key={g.id}
              className="student-group-card"
              onClick={() => {
                setSelectedGroupId(g.id)
                fetchMembers(g.id)
                fetchSubmission(g.id)
              }}
            >
              <h3>Group {index + 1}</h3>

              <p>Leader: {g.leader ? g.leader.name : "Not Assigned"}</p>
              <p>Members: {g.members?.length || 0}</p>

              {joinedGroupId === g.id ? (
                <button disabled>Already Joined</button>
              ) : (
                <button onClick={(e) => {
                  e.stopPropagation()
                  handleJoinGroup(g.id)
                }}>
                  Join Group
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* MEMBERS */}
      {selectedGroupId && (
        <div className="student-section-card">
          <h2>Members</h2>

          {members.length === 0 ? (
            <p>No members yet</p>
          ) : (
            members.map(m => (
              <p key={m.id}>{m.name}</p>
            ))
          )}
        </div>
      )}

      {/* 🔥 SUBMISSION SECTION */}
      {joinedGroupId === selectedGroupId && (
        <div className="student-section-card">
          <h2>Submission</h2>

          {submission ? (
            <>
              <p><b>File:</b> {submission.fileName}</p>
              <p><b>Marks:</b> {submission.marks || "Not Given"}</p>

              <a
                href={`${API}/studentapi/downloadsubmission?submissionId=${submission.id}`}
                target="_blank"
                rel="noreferrer"
              >
                Download PDF
              </a>
            </>
          ) : (
            <>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button onClick={handleUpload}>
                Submit PDF
              </button>
            </>
          )}
        </div>
      )}

    </div>
  )
}

export default ProjectGroups