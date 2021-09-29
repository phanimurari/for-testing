import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import Profile from '../Profile'
import JobsListAll from '../JobsListAll'
import EmploymentTypesList from '../EmploymentTypesList'
import SalaryRangesList from '../SalaryRangesList'

import './index.css'

const apiJobsConstant = {
  start: 'START',
  success: 'SUCCESS',
  failure: 'FAILURE',
  progress: 'PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    apiJobsStatus: apiJobsConstant.start,
    jobsList: '',
    employ: employmentTypesList,
    ranges: salaryRangesList,
    searchInput: '',
    activeRangesId: salaryRangesList[0].salaryRangeId,
    type: [],
  }

  componentDidMount() {
    this.getJobDetails()
  }

  onSuccessJobs = data => {
    this.setState({apiJobsStatus: apiJobsConstant.success, jobsList: data})
  }

  getJobDetails = async () => {
    const {searchInput, activeRangesId, type} = this.state
    const employee = type.join(',')
    this.setState({apiJobsStatus: apiJobsConstant.progress})
    const token = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employee}&minimum_package=${activeRangesId}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.onSuccessJobs(updatedData)
    } else {
      this.setState({apiJobsStatus: apiJobsConstant.failure})
    }
  }

  renderSuccess = job => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return (
        <div className="no-jobs">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1>No Jobs Found</h1>
          <p>We could not find any jobs. Try other filters</p>
        </div>
      )
    }
    return (
      <>
        <ul className="ul-job">
          {job.map(each => (
            <JobsListAll jobs={each} key={each.id} />
          ))}
        </ul>
      </>
    )
  }

  retryJobs = () => this.getJobDetails()

  renderFailure = () => (
    <div className="failure-jobs-list">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.retryJobs} className="logout">
        Retry
      </button>
    </div>
  )

  renderProgress = () => (
    <div className="loader-containers">
      <div className="loader-container loader-containers" testid="loader">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchIcon = () => {
    const {searchInput} = this.state
    this.getJobDetails()
    this.setState({searchInput})
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    const {apiJobsStatus} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    switch (apiJobsStatus) {
      case apiJobsConstant.success:
        return this.renderSuccess(jobsList)
      case apiJobsConstant.failure:
        return this.renderFailure()
      case apiJobsConstant.progress:
        return this.renderProgress()
      default:
        return null
    }
  }

  onClickRange = activeRangeId => {
    this.setState({activeRangesId: activeRangeId}, this.getJobDetails)
  }

  onChangeEmployment = employmentTypes => {
    this.setState(
      previous => ({
        type: [...previous.type, employmentTypes],
      }),
      this.getJobDetails,
    )
  }

  render() {
    const {employ, ranges, searchInput} = this.state

    return (
      <div>
        <Header />
        <div className="jobs-details">
          <div className="profile-and-types">
            <Profile />
            <hr className="line" />
            <ul className="ul-employees">
              <h1>Types of Employment</h1>
              {employ.map(eachEmployee => (
                <EmploymentTypesList
                  employees={eachEmployee}
                  key={eachEmployee.employmentTypeI}
                  onChangeEmployment={this.onChangeEmployment}
                />
              ))}
            </ul>
            <hr className="line" />
            <ul className="ul-employees">
              <h1>Salary Range</h1>
              {ranges.map(eachSalary => (
                <SalaryRangesList
                  salaries={eachSalary}
                  key={eachSalary.salaryRangeId}
                  onClickRange={this.onClickRange}
                />
              ))}
            </ul>
          </div>
          <div className="items-box">
            <div className="input-search">
              <input
                type="search"
                className="search"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearch}
              />
              <button
                type="button"
                testid="searchButton"
                className="search-icons"
                onClick={this.onClickSearchIcon}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsList()}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
