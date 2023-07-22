import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Navbar from '../Navbar'
import ProjectItem from '../ProjectItem'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    activeOptionId: categoriesList[0].id,
    projectList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectData()
  }

  getProjectData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {activeOptionId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = data.projects.map(eachProject => ({
        name: eachProject.name,
        id: eachProject.id,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        projectList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onChangeCategory = event => {
    this.setState({activeOptionId: event.target.value}, this.getProjectData)
  }

  renderProjectData = () => {
    const {activeOptionId, projectList} = this.state
    return (
      <div className="option-container">
        <div className="top-bg">
          <select
            onChange={this.onChangeCategory}
            value={activeOptionId}
            className="option"
          >
            {categoriesList.map(each => (
              <option value={each.id} key={each.id} className="each-option">
                {each.displayText}
              </option>
            ))}
          </select>
        </div>
        <div>
          <ul className="un-order">
            {projectList.map(each => (
              <ProjectItem key={each.id} projectDetails={each} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  projectFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="desc">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.getProjectData()}>
        Retry
      </button>
    </div>
  )

  renderAllData = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjectData()
      case apiStatusConstants.failure:
        return this.projectFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Navbar />
        <div>{this.renderAllData()}</div>
      </>
    )
  }
}

export default Home
