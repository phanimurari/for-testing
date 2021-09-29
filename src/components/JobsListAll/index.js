import {Link} from 'react-router-dom'

import {BsStarFill} from 'react-icons/bs'
import {ImLocation} from 'react-icons/im'
import {GrMail} from 'react-icons/gr'

import './index.css'

const JobsListAll = props => {
  const {jobs} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobs
  return (
    <Link to={`/jobs/${id}`} className="link-job">
      <li className="job-list">
        <div className="logo-container">
          <img src={companyLogoUrl} alt="company logo" className="company" />
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
    </Link>
  )
}
export default JobsListAll
