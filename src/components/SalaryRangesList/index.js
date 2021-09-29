import {Component} from 'react'
import './index.css'

class SalaryRangesList extends Component {
  render() {
    const {salaries, onClickRange} = this.props
    const {label, salaryRangeId} = salaries
    const changeRange = () => {
      onClickRange(salaryRangeId)
    }
    return (
      <li className="list-employees">
        <input
          type="radio"
          className="box"
          value={salaryRangeId}
          id={salaryRangeId}
          onClick={changeRange}
        />
        <label htmlFor={label}>{label}</label>
      </li>
    )
  }
}

export default SalaryRangesList
