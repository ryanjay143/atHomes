import "../../../components/style.css";
import Sales from "./children/Sales";
import DeveloperPartners from "./children/DeveloperPartners";
import TopPerformers from "./children/TopPerformers";
import TopAgent from "./children/TopAgent";
import AffiaiatedCard from "./children/AffiaiatedCard";


function DashboardContainer () {

  // Render the components here
  return (
    <div className="py-5 md:pt-20">
      <div>
        <h1 className="text-4xl font-bold ml-72 md:ml-0 md:grid-cols-1 md:gap-2 md:p-5 md:mt-0">Dashboard</h1>
        <AffiaiatedCard />
      </div>
      <div className="ml-72 md:ml-0 grid grid-cols-2 md:grid-cols-1 md:gap-2 md:p-5 md:mt-0 gap-2 items-start justify-center mt-5 md:px-5 mr-2">
        <Sales />
        <DeveloperPartners />
      </div>
      <div className="ml-72 md:ml-0 grid grid-cols-2 md:grid-cols-1 md:gap-2 md:p-5 md:mt-0 gap-2 items-start justify-center mt-5 md:px-5 mr-2">
        <TopPerformers />
        <TopAgent />
      </div>
    </div>
  );
};

export default DashboardContainer;