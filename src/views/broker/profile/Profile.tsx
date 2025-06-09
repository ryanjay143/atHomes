import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { faAngleDown, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import axios from '../../../plugin/axios';

const handleLogout = async (navigate: any) => {
  try {
    // Define headers for the request
  

    // Call the backend API to invalidate the Sanctum session with headers
   await axios.post('logout', {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      }
    });


    // Clear any client-side state related to authentication
    localStorage.clear();
    console.clear();

    // Navigate to the home page
    navigate('/athomes');
  } catch (error) {
    console.error('Logout failed', error);
    localStorage.clear();
    navigate('/athomes', { replace: true });
  }
};

function Profile() {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center cursor-pointer">
          <div className='relative flex flex-col items-center'>
            <div className='absolute top-7 left-10 md:left-5 md:w-5 md:h-5 bg-[#172554] rounded-full z-50 px-2 py-1 text-[#eff6ff]'>
              <FontAwesomeIcon icon={faAngleDown} className='md:w-4 md:h-4 md:mb-9 md:absolute md:ml-[-8px]' />
            </div>
            <Avatar className='cursor-pointer h-16 w-16 md:h-12 md:w-12 border-primary border-4'>
              <AvatarImage src='../image/aldin.jpg' alt='profile' className='rounded-full border border-border object-cover' />
            </Avatar>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-10">
        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
          <div
            className="flex items-center gap-2 text-foreground cursor-pointer"
            onClick={() => navigate('broker-profile')}
          >
            <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-foreground" />
            View Profile
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <div className="flex items-center gap-2 text-red-600 cursor-pointer" onClick={() => handleLogout(navigate)}>
            <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5 text-red-600 cursor-pointer" />
            <span>Logout</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Profile;