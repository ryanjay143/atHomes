import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserClock, faCheckCircle, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

export const navItems = [
  {
    label: "List of Brokers/Agents",
    to: "/athomes/admin/affialiated",
    icon: <FontAwesomeIcon icon={faUsers} className="mr-2" />,
  },
  {
    label: "List of Pending Register",
    to: "/athomes/admin/affialiated/pendingRegister",
    icon: <FontAwesomeIcon icon={faUserClock} className="mr-2" />,
  },
  {
    label: "List of Licensed",
    to: "/athomes/admin/affialiated/licensed",
    icon: <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />,
  },
  {
    label: "List of Unlicensed",
    to: "/athomes/admin/affialiated/unlicensed",
    icon: <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />,
  },
];

export default navItems;