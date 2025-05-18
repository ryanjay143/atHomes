import { faFaceSmile, faUserShield } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import axios from "../../../plugin/axios"


function Header() {
  const [user, setUser] = useState<any>({});
  const [personalinfo, setPersonalInfo] = useState<any>({});


  const agentUser = async () => {
    try {
      const response = await axios.get('user/agent-broker', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
    
      setUser(response.data.user);
      setPersonalInfo(response.data.personalInfo);
      console.log('User data:', response.data.user);
      console.log('Personal info:', response.data.personalInfo);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  useEffect(() => {
    agentUser();
  }, []);

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

  const capitalizeFirstLetter = (string: string | undefined) => {
    if (!string) return ""; // Return an empty string if the input is undefined or null
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  
  return (
    <div className="flex flex-row items-center gap-4">
        <div className="flex flex-col items-start md:items-center md:justify-center md:ml-20">
            <span className="text-accent text-2xl md:text-sm font-bold">
              Hey, {capitalizeFirstLetter(personalinfo.first_name)} {capitalizeFirstLetter(personalinfo.middle_name)} {capitalizeFirstLetter(personalinfo.last_name)} {capitalizeFirstLetter(personalinfo.extension_name)}
              <FontAwesomeIcon icon={faFaceSmile} />
            </span> 
            <div className="flex flex-row items-center gap-2">
                <FontAwesomeIcon icon={faUserShield} className="text-accent" />
                <span className="text-accent text-base md:text-sm">Role: {role}</span> 
            </div>
        </div>
    </div>
  )
}

export default Header

