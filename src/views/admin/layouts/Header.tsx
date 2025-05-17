import { faFaceSmile, faUserShield } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"


function Header() {
  const [role, setRole] = useState<string>("Unknown")
  
  useEffect(() => {
    const roleValue = localStorage.getItem("role")
    switch (roleValue) {
      case "0":
        setRole("Admin")
        break
      case "1":
        setRole("Agent")
        break
      case "2":
        setRole("Broker")
        break
      default:
        setRole("Unknown")
    }
  }, [])
  
  return (
    <div className="flex flex-row items-center md:item-center md:ml-24 gap-4">
      <div className="flex flex-col items-start md:items-center md:justify-center md:ml-0 md:w-full">
          <span className="text-accent text-2xl md:text-sm font-bold md:text-start">
              Hey, Aldin Tagolimot <FontAwesomeIcon icon={faFaceSmile} />
          </span>
          <div className="flex flex-row items-center gap-2 md:justify-center">
              <FontAwesomeIcon icon={faUserShield} className="text-accent" />
              <span className="text-accent text-base md:text-sm">Role: {role}</span>
          </div>
      </div>
  </div>
  )
}

export default Header

