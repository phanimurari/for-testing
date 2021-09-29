import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
      <>
        <label htmlFor="username">USERNAME</label>
        <input
          type="text"
          id="username"
          className="input"
          placeholder="Username"
          value={username}
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  renderPasswordField = () => {
    const {password} = this.state

    return (
      <>
        <label htmlFor="password">PASSWORD</label>
        <input
          type="password"
          id="password"
          className="input"
          value={password}
          placeholder="Password"
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  successfulLogin = token => {
    const {history} = this.props
    Cookies.set('jwt_token', token, {expires: 30})
    history.replace('/')
  }

  onFailureLogin = msg => {
    this.setState({errorMsg: msg, showError: true})
  }

  submitDetails = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    console.log(data)
    this.setState({username: '', password: ''})
    if (response.ok === true) {
      this.successfulLogin(data.jwt_token)
    } else {
      this.onFailureLogin(data.error_msg)
    }
  }

  render() {
    const {showError, errorMsg} = this.state
    const isLoggedIn = Cookies.get('jwt_token')
    if (isLoggedIn !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg">
        <form className="card" onSubmit={this.submitDetails}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-logo"
          />
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>
          <button type="submit" className="login-btn">
            Login
          </button>
          {showError ? <p className="error">*{errorMsg}</p> : null}
        </form>
      </div>
    )
  }
}
export default Login
