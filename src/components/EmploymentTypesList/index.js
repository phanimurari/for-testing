import {Component} from 'react'
import './index.css'

class EmploymentTypesList extends Component {
  filterEmployee = () => {
    const {employees, onChangeEmployment} = this.props
    const {employmentTypeId} = employees
    onChangeEmployment(employmentTypeId)
  }

  render() {
    const {employees} = this.props
    const {label, employmentTypeId} = employees

    return (
      <li className="list-employees">
        <input
          type="checkbox"
          className="box"
          value={employmentTypeId}
          id={employmentTypeId}
          onClick={this.filterEmployee}
        />
        <label htmlFor={label}>{label}</label>
      </li>
    )
  }
}

export default EmploymentTypesList
