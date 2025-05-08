import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"


function TopAgent () {
  return (
   <>
    <Card className="fade-in-right w-full md:w-full bg-[#eff6ff] border-b-4 border-primary">
          <CardHeader className="text-center">
            <CardTitle>Top 10 Agents</CardTitle>
            <CardDescription>of the month</CardDescription>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-5 gap-4 h-56 ">
            <div className='relative flex flex-col items-center'>
              <div className='absolute top-0 left-3 bg-[#172554] rounded-full z-50 px-2 py-1 text-[#eff6ff]'>1</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className='cursor-pointer h-16 w-16 border-primary border-4'>
                    <AvatarImage src='../../../../image/aldin.jpg' alt='profile' className='rounded-full border border-border object-cover ' />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className='p-4 bg-white shadow-lg rounded-lg'>
                  
                </PopoverContent>
              </Popover>
              <div className='text-center'>
                <p className="text-sm font-bold">Aldin T.</p>
                <p className="text-sm">PHP 10M</p>
              </div> 
            </div>

            <div className='relative flex flex-col items-center'>
              <div className='absolute top-0 left-3 bg-[#172554] rounded-full z-50 px-2 py-1 text-[#eff6ff]'>2</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className='cursor-pointer h-16 w-16 border-primary border-4'>
                    <AvatarImage src='../../../../image/venus.jpg' alt='profile' className='rounded-full border border-border object-cover ' />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className='p-4 bg-white shadow-lg rounded-lg'>
                  
                </PopoverContent>
              </Popover>
              <div className='text-center'>
                <p className="text-sm font-bold">Venus R.</p>
                <p className="text-sm">PHP 9M</p>
              </div> 
            </div>

            <div className='relative flex flex-col items-center'>
              <div className='absolute top-0 left-3 bg-[#172554] rounded-full z-50 px-2 py-1 text-[#eff6ff]'>3</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className='cursor-pointer h-16 w-16 border-primary border-4'>
                    <AvatarImage src='../../../../image/venet.jpg' alt='profile' className='rounded-full border border-border object-cover ' />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className='p-4 bg-white shadow-lg rounded-lg'>
                  
                </PopoverContent>
              </Popover>
              <div className='text-center'>
                <p className="text-sm font-bold">Veronica P.</p>
                <p className="text-sm">PHP 8M</p>
              </div> 
            </div>

            <div className='relative flex flex-col items-center'>
              <div className='absolute top-0 left-3 bg-[#172554] rounded-full z-50 px-2 py-1 text-[#eff6ff]'>4</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className='cursor-pointer h-16 w-16 border-primary border-4'>
                    <AvatarImage src='../../../../image/riki.jpg' alt='profile' className='rounded-full border border-border object-cover ' />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className='p-4 bg-white shadow-lg rounded-lg'>
                  
                </PopoverContent>
              </Popover>
              <div className='text-center'>
                <p className="text-sm font-bold">Ricky R.</p>
                <p className="text-sm">PHP 7M</p>
              </div> 
            </div>

            <div className='relative flex flex-col items-center'>
              <div className='absolute top-0 left-3 bg-[#172554] rounded-full z-50 px-2 py-1 text-[#eff6ff]'>5</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className='cursor-pointer h-16 w-16 border-primary border-4'>
                    <AvatarImage src='../../../../image/ryan.jpg' alt='profile' className='rounded-full border border-border object-cover ' />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className='p-4 bg-white shadow-lg rounded-lg'>
                  
                </PopoverContent>
              </Popover>
              <div className='text-center'>
                <p className="text-sm font-bold">Ryan R.</p>
                <p className="text-sm">PHP 6M</p>
              </div> 
            </div>
            
            <div className='relative flex flex-col items-center'>
              <div className='absolute top-0 left-3 bg-[#172554] rounded-full z-50 px-2 py-1 text-[#eff6ff]'>6</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className='cursor-pointer h-16 w-16 border-primary border-4'>
                    <AvatarImage src='../../../../image/aldin.jpg' alt='profile' className='rounded-full border border-border object-cover ' />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className='p-4 bg-white shadow-lg rounded-lg'>
                  
                </PopoverContent>
              </Popover>
              <div className='text-center'>
                <p className="text-sm font-bold">Aldin T.</p>
                <p className="text-sm">PHP 10M</p>
              </div> 
            </div>

            <div className='relative flex flex-col items-center'>
              <div className='absolute top-0 left-3 bg-[#172554] rounded-full z-50 px-2 py-1 text-[#eff6ff]'>7</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className='cursor-pointer h-16 w-16 border-primary border-4'>
                    <AvatarImage src='../../../../image/venus.jpg' alt='profile' className='rounded-full border border-border object-cover ' />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className='p-4 bg-white shadow-lg rounded-lg'>
                  
                </PopoverContent>
              </Popover>
              <div className='text-center'>
                <p className="text-sm font-bold">Venus R.</p>
                <p className="text-sm">PHP 9M</p>
              </div> 
            </div>

            <div className='relative flex flex-col items-center'>
              <div className='absolute top-0 left-3 bg-[#172554] rounded-full z-50 px-2 py-1 text-[#eff6ff]'>8</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className='cursor-pointer h-16 w-16 border-primary border-4'>
                    <AvatarImage src='../../../../image/venet.jpg' alt='profile' className='rounded-full border border-border object-cover ' />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className='p-4 bg-white shadow-lg rounded-lg'>
                  
                </PopoverContent>
              </Popover>
              <div className='text-center'>
                <p className="text-sm font-bold">Veronica P.</p>
                <p className="text-sm">PHP 8M</p>
              </div> 
            </div>

            <div className='relative flex flex-col items-center'>
              <div className='absolute top-0 left-3 bg-[#172554] rounded-full z-50 px-2 py-1 text-[#eff6ff]'>9</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className='cursor-pointer h-16 w-16 border-primary border-4'>
                    <AvatarImage src='../../../../image/riki.jpg' alt='profile' className='rounded-full border border-border object-cover ' />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className='p-4 bg-white shadow-lg rounded-lg'>
                  
                </PopoverContent>
              </Popover>
              <div className='text-center'>
                <p className="text-sm font-bold">Ricky R.</p>
                <p className="text-sm">PHP 7M</p>
              </div> 
            </div>

            <div className='relative flex flex-col items-center'>
              <div className='absolute top-0 left-3 bg-[#172554] rounded-full z-50 px-2 py-1 text-[#eff6ff]'>10</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className='cursor-pointer h-16 w-16 border-primary border-4'>
                    <AvatarImage src='../../../../image/ryan.jpg' alt='profile' className='rounded-full border border-border object-cover ' />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className='p-4 bg-white shadow-lg rounded-lg'>
                  
                </PopoverContent>
              </Popover>
              <div className='text-center'>
                <p className="text-sm font-bold">Ryan R.</p>
                <p className="text-sm">PHP 6M</p>
              </div> 
            </div>

            
          </div>
          </CardContent>
        </Card>
   </>
  )
}

export default TopAgent
