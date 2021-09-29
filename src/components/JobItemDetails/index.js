import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsStarFill, BsBoxArrowInUpRight} from 'react-icons/bs'
import {ImLocation} from 'react-icons/im'
import {GrMail} from 'react-icons/gr'
import Header from '../Header'
import './index.css'

const apiJobEachConstant = {
  start: 'START',
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}

const Skills = props => {
  const {skill} = props
  const {name, imageUrl} = skill
  return (
    <li className="skill-list">
      <img src={imageUrl} alt={name} className="skill-logo" />
      <p>{name}</p>
    </li>
  )
}

const SimilarJobsGET = props => {
  const {similarJobs} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = similarJobs
  return (
    <li className="job-list">
      <div className="logo-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company"
        />
        <div>
          <h1>{title}</h1>
          <div className="star">
            <BsStarFill />
            <p>{rating}</p>
          </div>
        </div>
      </div>
      <div className="map">
        <div className="map">
          <ImLocation />
          <p>{location}</p>
        </div>
        <div className="map">
          <GrMail />
          <p>{employmentType}</p>
        </div>
        <p>{packagePerAnnum}</p>
      </div>
      <hr className="line" />
      <div>
        <h1>Description</h1>
        <p>{jobDescription}</p>
      </div>
    </li>
  )
}

const Life = props => {
  const {details} = props
  const {description, imageUrl} = details
  return (
    <li className="list-life">
      <p>{description}</p>
      <img src={imageUrl} alt="life at company" />
    </li>
  )
}

class JobItemDetails extends Component {
  state = {
    apiJobEachStatus: apiJobEachConstant.start,
    jobDetails: '',
    skills: '',
    life: '',
    similarJobs: '',
  }

  componentDidMount() {
    this.getEachJobDetails()
  }

  getEachJobDetails = async () => {
    this.setState({apiJobEachStatus: apiJobEachConstant.progress})
    const token = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const eachJob = data.job_details
      const updatedJobDetails = {
        companyLogoUrl: eachJob.company_logo_url,
        companyWebsiteUrl: eachJob.company_website_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }
      const updatedSkills = eachJob.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))
      const updatedLife = {
        description: eachJob.life_at_company.description,
        imageUrl: eachJob.life_at_company.image_url,
      }
      const similar = data.similar_jobs
      const updatedSimilarJobs = similar.map(eachSimilar => ({
        companyLogoUrl: eachSimilar.company_logo_url,
        employmentType: eachSimilar.employment_type,
        jobDescription: eachSimilar.job_description,
        location: eachSimilar.location,
        id: eachSimilar.id,
        packagePerAnnum: eachSimilar.package_per_annum,
        rating: eachSimilar.rating,
        title: eachSimilar.title,
      }))

      this.setState({
        apiJobEachStatus: apiJobEachConstant.success,
        jobDetails: updatedJobDetails,
        skills: updatedSkills,
        life: updatedLife,
        similarJobs: updatedSimilarJobs,
      })
    } else {
      this.setState({apiJobEachStatus: apiJobEachConstant.failure})
    }
  }

  isProgress = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  retryJobsItems = () => {
    this.getEachJobDetails()
  }

  renderFailure = () => (
    <div className="failure-jobs-list">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.retryJobsItems} className="logout">
        Retry
      </button>
    </div>
  )

  renderSuccess = () => {
    const {jobDetails, skills, life, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails

    return (
      <>
        <li className="job-list">
          <div className="logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company"
            />
            <div>
              <h1>{title}</h1>
              <div className="star">
                <BsStarFill />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="map">
            <div className="map">
              <ImLocation />
              <p>{location}</p>
            </div>
            <div className="map">
              <GrMail />
              <p>{employmentType}</p>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr className="line" />
          <div>
            <h1>Description</h1>
            <a href={companyWebsiteUrl}>
              <button type="button" className="visit">
                Visit <BsBoxArrowInUpRight />
              </button>
            </a>
            <p>{jobDescription}</p>
          </div>
        </li>
        <div>
          <ul className="skills-ul">
            <p className="s">Skills</p>
            {skills.map(eachSkills => (
              <Skills skill={eachSkills} key={eachSkills.name} />
            ))}
          </ul>
        </div>
        <div>
          <h1 className="s">Life at Company</h1>
          <ul>
            <Life details={life} />
          </ul>
        </div>
        <div>
          <h1>Similar Jobs</h1>
          <ul>
            {similarJobs.map(each => (
              <SimilarJobsGET similarJobs={each} key={each.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderDetails = () => {
    const {apiJobEachStatus} = this.state
    switch (apiJobEachStatus) {
      case apiJobEachConstant.success:
        return this.renderSuccess()
      case apiJobEachConstant.failure:
        return this.renderFailure()
      case apiJobEachConstant.progress:
        return this.isProgress()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div className="jobsEach">{this.renderDetails()}</div>
      </div>
    )
  }
}
export default JobItemDetails
