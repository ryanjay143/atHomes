import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


function Dashboard() {
  return (
    <div className="py-5 md:pt-20">
      <div className="ml-72 md:ml-0 grid grid-cols-2 md:grid-cols-1 md:gap-2 md:p-5 md:mt-0 gap-2 items-start justify-center mt-5 md:px-5 mr-2">
        <div>
        <Card className="bg-[#eff6ff] border-b-4 border-primary w-full md:w-full">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>

        </div>
        <div>
        <Card className="bg-[#eff6ff] border-b-4 border-primary w-full md:w-full">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter>
            <p>Card Footer</p>
          </CardFooter>
        </Card>   </div>

<div>
        <Card className="bg-[#eff6ff] border-b-4 border-primary w-full md:w-full">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>   </div>


<Card className="bg-[#eff6ff] border-b-4 border-primary w-full md:w-full">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>  
      </div>
    </div>
  )
}

export default Dashboard
