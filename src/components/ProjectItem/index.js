import './index.css'

const ProjectItem = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails

  return (
    <li className="list">
      <img src={imageUrl} alt={name} className="logo" />
      <p className="name"> {name}</p>
    </li>
  )
}

export default ProjectItem
