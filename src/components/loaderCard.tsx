import '../components/loaderCard.css'
import logo from '/favicon.png'

const LoaderCard = () => {
  return (
    <div className="flex items-center justify-center h-40 w-full relative">
      <div className="loader-card">
        <img src={logo} alt="Logo" className="loader-card-image" />
        <div className="loader-card-glow"></div>
      </div>
    </div>
  )
}

export default LoaderCard
