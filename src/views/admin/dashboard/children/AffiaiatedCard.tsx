import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "../../../../plugin/axios"
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCircleXmark, faIdBadge, faUserClock, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import '../style.css'

function AffiaiatedCard() {
    const [brokeraAgentCount, setBrokerAgent] = useState<number>(0);  
    const [pendingRegistered, setPendingRegistered] = useState<number>(0);
    const [agentLicensed, setAgentLicensed] = useState<number>(0);
    const [agentUnLicensed, setagentUnLicensed] = useState<number>(0);
    
    const navigate = useNavigate();

    const cardCounts = async () => {
    try {
      const response = await axios.get('agent-broker', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        },
      });

      setBrokerAgent(response.data.agentsListCount || 0);
      setPendingRegistered(response.data.pendingAgentsCount || 0)
      setAgentLicensed(response.data.agentsLicensedCount || 0)
      setagentUnLicensed(response.data.agentsUnlicensedCount || 0)
    } catch (error) {

      console.error('Error fetching members:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch data. Please login again.',
        confirmButtonText: 'OK',
      })
      localStorage.clear();
      console.clear();
      navigate('/');
      
    }
  };

   useEffect(() => {
    cardCounts();
  }, []);

  // Card data for mapping
  const cards = [
    {
      to: "/admin/affialiated",
      count: brokeraAgentCount,
      title: "Total Broker/Agents",
      icon: faUsers,
      iconColor: "text-blue-400",
      cardGradient: "from-blue-100 via-blue-50 to-white",
      borderColor: "border-blue-400",
      textColor: "text-blue-700",
      glow: "shadow-blue-200",
    },
    {
      to: "/admin/affialiated/pendingRegister",
      count: pendingRegistered,
      title: "Pending Register",
      icon: faUserClock,
      iconColor: "text-yellow-400",
      cardGradient: "from-yellow-100 via-yellow-50 to-white",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-700",
      glow: "shadow-yellow-200",
    },
    {
      to: "/admin/affialiated/licensed",
      count: agentLicensed,
      title: "Total Licensed Affiliated",
      icon: faIdBadge,
      iconColor: "text-green-400",
      cardGradient: "from-green-100 via-green-50 to-white",
      borderColor: "border-green-400",
      textColor: "text-green-700",
      glow: "shadow-green-200",
    },
    {
      to: "/admin/affialiated/unlicensed",
      count: agentUnLicensed,
      title: "Total Unlicensed Affiliated",
      icon: faFileCircleXmark,
      iconColor: "text-red-400",
      cardGradient: "from-red-100 via-red-50 to-white",
      borderColor: "border-red-400",
      textColor: "text-red-700",
      glow: "shadow-red-200",
    },
  ];

  return (
    <div className="ml-72 md:ml-0 grid grid-cols-4 md:grid-cols-1 md:gap-4 md:p-5 md:mt-0 gap-6 items-start justify-center mt-5 md:px-5 mr-2">
      {cards.map((card) => (
        <Link to={card.to} className="block group" key={card.title}>
          <Card
            className={`
              w-full md:w-full
              bg-gradient-to-br ${card.cardGradient}
              border-b-4 ${card.borderColor}
              rounded-2xl shadow-xl ${card.glow}
              backdrop-blur-md
              transition-all duration-300
              hover:scale-105 hover:shadow-2xl hover:border-t-4 hover:border-opacity-80
              hover:bg-opacity-90
              relative overflow-hidden
            `}
            style={{
              boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10)",
              borderTop: "2px solid rgba(59,130,246,0.08)",
            }}
          >
            {/* Decorative blurred circle */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/40 rounded-full blur-2xl opacity-60 pointer-events-none"></div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`text-4xl font-extrabold ${card.textColor} drop-shadow-lg group-hover:scale-110 transition-transform duration-300 slow-bounce`}>
                    {card.count}
                </CardTitle>
                <div className={`ml-2 h-12 w-12 flex items-center justify-center rounded-full bg-white/70 group-hover:bg-white/90 shadow-md transition-all duration-300`}>
                  <FontAwesomeIcon icon={card.icon} className={`text-3xl ${card.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                </div>
              </div>
              <CardDescription className={`font-bold ${card.textColor} md:text-xs mt-2`}>
                {card.title}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default AffiaiatedCard