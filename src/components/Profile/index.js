import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiProfileConstant = {
  start: 'START',
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}

class Profile extends Component {
  state = {
    profileDetails: '',
    apiProfileStatus: apiProfileConstant.start,
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  onSuccessProfile = data => {
    this.setState({
      profileDetails: data,
      apiProfileStatus: apiProfileConstant.success,
    })
  }

  retry = () => {
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    this.setState({apiProfileStatus: apiProfileConstant.progress})
    const token = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)
    const data = await response.json()
    const details = data.profile_details
    const updatedProfileDetails = {
      name: details.name,
      profileImageUrl: details.profile_image_url,
      shortBio: details.short_bio,
    }
    if (response.ok === true) {
      this.onSuccessProfile(updatedProfileDetails)
    } else if (response.status === 401) {
      this.setState({apiProfileStatus: apiProfileConstant.failure})
    }
  }

  renderProgress = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileDetailsFailure = () => (
    <div className="retry-btn">
      <button type="button" onClick={this.retry} className="logout">
        Retry
      </button>
    </div>
  )

  renderProfileDetails = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="username">{name}</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  render() {
    const {apiProfileStatus} = this.state
    switch (apiProfileStatus) {
      case apiProfileConstant.success:
        return this.renderProfileDetails()
      case apiProfileConstant.failure:
        return this.renderProfileDetailsFailure()
      case apiProfileConstant.progress:
        return this.renderProgress()
      default:
        return null
    }
  }
}
export default Profile
