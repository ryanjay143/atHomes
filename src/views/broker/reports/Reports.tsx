import NavigationReport from '../../broker/reports/navigation/NavigationReport'
import CardReport from './card/CardReport'



function Reports() {
  return (
    <div className='py-5 md:pt-20'>
      <div className='ml-72 md:ml-0 md:w-full gap-2 items-start justify-center mr-5 md:px-5'>
        <NavigationReport />

        <CardReport />
      </div>
    </div>
  )
}

export default Reports
