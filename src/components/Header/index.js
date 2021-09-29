import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-bar">
      <li className="l">
        <Link to="/" className="link">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-logo"
          />
        </Link>
      </li>
      <div className="h">
        <li className="l">
          <Link to="/" className="link">
            <p className="home-jobs">Home</p>
          </Link>
        </li>
        <li className="l">
          <Link to="/jobs" className="link">
            <p className="home-jobs">Jobs</p>
          </Link>
        </li>
      </div>
      <button type="button" className="logout" onClick={onClickLogout}>
        Logout
      </button>
    </nav>
  )
}
export default withRouter(Header)
