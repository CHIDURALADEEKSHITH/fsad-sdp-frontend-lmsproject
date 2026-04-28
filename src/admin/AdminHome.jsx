import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Admin.css'

const AdminHome = () => {
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalTeachers, setTotalTeachers] = useState(0)
  const [totalSubjects, setTotalSubjects] = useState(0)
  const [loading, setLoading] = useState(true)

  const admin = JSON.parse(sessionStorage.getItem('loggedInAdmin'))

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [studentsRes, teachersRes, subjectsRes] = await Promise.all([
          axios.get('http://localhost:2910/adminapi/totalstudents'),
          axios.get('http://localhost:2910/adminapi/totalteachers'),
          axios.get('http://localhost:2910/adminapi/viewallsubjects')
        ])
        setTotalStudents(studentsRes.data)
        setTotalTeachers(teachersRes.data)
        setTotalSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data.length : 0)
      } catch (err) {
        console.error('Error fetching counts', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCounts()
  }, [])

  return (
    <div>
      <div className="admin-welcome-card">
        <div>
          <h2>Welcome back, {admin?.username || 'Admin'}</h2>
          <p>Here is an overview of the Group Project Portal</p>
        </div>
        <span className="admin-welcome-badge">Administrator</span>
      </div>

      {loading ? (
        <p className="admin-loading">Loading dashboard...</p>
      ) : (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-label">Total Students</span>
            <span className="admin-stat-value">{totalStudents}</span>
            <span className="admin-stat-sub">Registered students</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Total Teachers</span>
            <span className="admin-stat-value">{totalTeachers}</span>
            <span className="admin-stat-sub">Registered teachers</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Total Subjects</span>
            <span className="admin-stat-value">{totalSubjects}</span>
            <span className="admin-stat-sub">Active subjects</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminHome

