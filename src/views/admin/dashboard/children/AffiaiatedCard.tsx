import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "../../../../plugin/axios"
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCircleXmark, faIdBadge, faUserClock, faUsers } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function AffiaiatedCard() {
    const [brokeraAgentCount, setBrokerAgent] = useState<number>(0);  
    const [pendingRegistered, setPendingRegistered] = useState<number>(0);
    const [agentLicensed, setAgentLicensed] = useState<number>(0);
    const [agentUnLicensed, setagentUnLicensed] = useState<number>(0);
    

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
      console.log("Pending Registered Count:", response.data.pendingAgentsCount)
      console.log("Agent Licensed Count:", response.data.agentsLicensedCount)
      console.log("Broker and Agent Count:", response.data.agentsListCount);
      console.log("Unlicensed Agents Count:", response.data.agentsUnlicensedCount);
      
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

   useEffect(() => {
    cardCounts();
  }, []);


  return (
    <div className="ml-72 md:ml-0 grid grid-cols-4 md:grid-cols-1 md:gap-2 md:p-5 md:mt-0 gap-2 items-start justify-center mt-5 md:px-5 mr-2">
          <Link to="/athomes/admin/affialiated" className="block">
            <Card className="fade-in-left w-full md:w-full bg-[#eff6ff] border-b-4 border-primary">
                <CardHeader>
                <div className="flex items-center justify-between"> 
                    <CardTitle className="text-3xl font-bold text-primary animate-bounce">
                    {brokeraAgentCount}
                    </CardTitle>
                    <FontAwesomeIcon icon={faUsers} className="ml-2 h-10 text-blue-300" />
                </div>
                <CardDescription className='font-bold text-primary md:text-xs'>Total Broker/Agents</CardDescription>
                </CardHeader>
            </Card>
            </Link>

            <Link to="/athomes/admin/affialiated/pendingRegister" className="block">
                <Card className="fade-in-left w-full md:w-full bg-[#eff6ff] border-b-4 border-primary">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-3xl font-bold text-black animate-bounce">
                                {pendingRegistered}
                            </CardTitle>
                            <FontAwesomeIcon icon={faUserClock} className="ml-2 h-10 text-[#3f3f46]" />
                        </div>
                    <CardDescription className='font-bold text-black md:text-xs'>Pending Register</CardDescription>
                    </CardHeader>
                </Card>
            </Link>

            <Link to="/athomes/admin/affialiated/licensed" className="block">
                <Card className="fade-in-left w-full md:w-full bg-[#eff6ff] border-b-4 border-primary">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-3xl font-bold text-green-500 animate-bounce">
                                {agentLicensed}
                            </CardTitle>
                            <FontAwesomeIcon icon={faIdBadge} className="ml-2 h-10 text-green-200" />
                        </div>
                    <CardDescription className='font-bold text-green-500 md:text-xs'>Total Licensed Affialiated</CardDescription>
                    </CardHeader>
                </Card>
            </Link>
          
            <Link to="/athomes/admin/affialiated/unlicensed" className="block">
                <Card className="fade-in-left w-full md:w-full bg-[#eff6ff] border-b-4 border-primary">
                    <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-3xl font-bold text-red-500 animate-bounce">
                            {agentUnLicensed}
                        </CardTitle>
                        <FontAwesomeIcon icon={faFileCircleXmark} className="ml-2 h-10 text-red-200" />
                    </div>
                    <CardDescription className='font-bold text-red-500 md:text-xs'>Total Unlicensed Affialiated</CardDescription>
                    </CardHeader>
                </Card>
            </Link>
         

          
        </div>
  )
}

export default AffiaiatedCard
