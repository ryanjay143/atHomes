import '../components/loader.css'
import logo from '/logo.png'

const loaderCard = () => {
  return (
    <div className='flex items-center justify-center h-96 top-64 left-1/2 absolute translate-x-[-50%] translate-y-[-50%]'>
      <div className="loader">
        <img src={logo} alt="Logo" className="loader-image" />
      </div>
    </div>
  )
}

export default loaderCard
