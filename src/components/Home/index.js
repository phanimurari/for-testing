import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <div className="header">
      <div>
        <ul>
          <Header />
        </ul>
        <div className="home-Show">
          <div className="home-details">
            <h1 className="home-heading">Find The Job That Fits Your Life</h1>
            <p className="home-para">
              Millions of people are searching for jobs,salary,informatin and
              company reviews.Find the jobs that fit your abilities and
              Potential
            </p>
            <Link to="/jobs">
              <button type="button">Find Jobs</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Home
