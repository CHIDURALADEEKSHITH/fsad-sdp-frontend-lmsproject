import React from 'react'
import './Style.css'

const Home = () => {
  return (
    <div className="home-page">
      <div className="home-hero">
        <h1 className="home-title">Group Project  Submissions Portal</h1>
        <p className="home-subtitle">A centralized platform to manage, submit and review academic group projects</p>
      </div>

      <div className="home-content">
        <p className="home-section-title">Portal Access</p>
        <div className="role-cards">
          <div className="role-card role-card-admin">
            <p className="role-card-label">Administrator</p>
            <h3 className="role-title">Admin Panel</h3>
            <ul className="role-ops">
              <li>Manage Students</li>
              <li>Manage Teachers</li>
              <li>View Dashboard</li>
              <li>Monitor Portal</li>
            </ul>
          </div>

          <div className="role-card role-card-student">
            <p className="role-card-label">Student</p>
            <h3 className="role-title">Student Panel</h3>
            <ul className="role-ops">
              <li>View Profile</li>
              <li>Submit Projects</li>
              <li>Track Submissions</li>
              <li>View Feedback</li>
            </ul>
          </div>

          <div className="role-card role-card-teacher">
            <p className="role-card-label">Faculty</p>
            <h3 className="role-title">Teacher Panel</h3>
            <ul className="role-ops">
              <li>View Profile</li>
              <li>Assign Projects</li>
              <li>Review Submissions</li>
              <li>Grade Students</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home