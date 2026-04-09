import React from 'react'
import { Link } from 'react-router-dom'
import './Style.css'

const PageNotFound = () => {
  return (
    <div className="not-found-page">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-text">The page you are looking for does not exist.</p>
      <Link to="/" className="not-found-home-link">Back to Home</Link>
    </div>
  )
}

export default PageNotFound