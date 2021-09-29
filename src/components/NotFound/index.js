import Header from '../Header'

import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <Header />
    <img
      src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
      alt="not found"
      className="notFound-img"
    />
    <h1 className="notFound-heading">Page Not Found</h1>
    <p className="notFound-heading">
      we’re sorry, the page you requested could not be found
    </p>
  </div>
)

export default NotFound
