import NavigationReport from '../../broker/reports/navigation/NavigationReport'
import CardReport from './card/CardReport'



function Reports() {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="ml-72 md:ml-0  gap-2 items-start justify-center mr-5 md:px-2 ">
        <NavigationReport />

        <CardReport />
      </div>
    </div>
  )
}

export default Reports
