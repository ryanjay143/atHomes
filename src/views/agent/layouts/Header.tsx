import { faUserShield, faSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "../../../plugin/axios";

function AgentHeader() {
  const [personalinfo, setPersonalInfo] = useState<any>({});
  const [role, setRole] = useState<string>("Unknown");

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const response = await axios.get('user/agent-broker', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setPersonalInfo(response.data.personalInfo);
      } catch (error) {
        // Handle error
      }
    };
    fetchPersonalInfo();
  }, []);

  useEffect(() => {
    const roleValue = localStorage.getItem("role");
    switch (roleValue) {
      case "0":
        setRole("Administrator");
        break;
      case "1":
        setRole("Agent");
        break;
      case "2":
        setRole("Broker");
        break;
      default:
        setRole("Unknown");
    }
  }, []);

  const capitalizeFirstLetter = (string: string | undefined) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Helper for initials
  const getInitials = () => {
    const first = personalinfo.first_name ? personalinfo.first_name.charAt(0).toUpperCase() : "";
    const last = personalinfo.last_name ? personalinfo.last_name.charAt(0).toUpperCase() : "";
    return first + last;
  };

  return (
    <div className="flex flex-row items-center gap-5">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {personalinfo.profile_pic ? (
          <img
            src={`${import.meta.env.VITE_URL}/${personalinfo.profile_pic}`}
            alt="Profile"
            className="w-14 h-14 rounded-full border-4 border-white shadow-md object-cover hover:scale-105 transition"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-md">
            {getInitials()}
          </div>
        )}
      </div>
      {/* Info */}
      <div className="flex flex-col items-start justify-center">
        <span className="flex items-center gap-2 text-accent text-xl md:text-lg font-bold">
          <FontAwesomeIcon icon={faSmile} className="text-yellow-400" />
          Hey, {capitalizeFirstLetter(personalinfo.first_name)} {capitalizeFirstLetter(personalinfo.last_name)}
        </span>
        <div className="flex flex-row items-center gap-2 mt-2">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 shadow">
            <FontAwesomeIcon icon={faUserShield} className="mr-1 text-blue-500" />
            {role}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AgentHeader;