import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserClock, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

export const navItems = [
  {
    label: "List of Brokers/Agents",
    to: "/admin/affialiated",
    icon: <FontAwesomeIcon icon={faUsers} className="mr-2" />,
  },
  {
    label: "List of Pending Register",
    to: "/admin/affialiated/pendingRegister",
    icon: <FontAwesomeIcon icon={faUserClock} className="mr-2" />,
  },
  {
    label: "List of Licensed",
    to: "/admin/affialiated/licensed",
    icon: <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />,
  },
  {
    label: "List of Unlicensed",
    to: "/admin/affialiated/unlicensed",
    icon: <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />,
  },
];

export default navItems;