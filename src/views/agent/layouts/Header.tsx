import { faFaceSmile, faUserShield } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"


function Header() {
    
  return (
    <div className="flex flex-row items-center gap-4">
        <div className="flex flex-col items-start md:items-center md:justify-center md:ml-20">
            <span className="text-accent text-2xl md:text-sm font-bold">Hey, Aldin Tagolimot <FontAwesomeIcon icon={faFaceSmile} /></span> 
            <div className="flex flex-row items-center gap-2">
                <FontAwesomeIcon icon={faUserShield} className="text-accent" />
                <span className="text-accent text-base md:text-sm">Role: Broker</span> 
            </div>
            {/* <div className="flex flex-row items-center md:items-center gap-2 md:hidden">
                <FontAwesomeIcon icon={faLocationPin} className="text-accent" />
                <span className="text-accent text-base ">Location: Cagayan de Oro City, 9001</span> 
            </div> */}
        </div>
    </div>
  )
}

export default Header

