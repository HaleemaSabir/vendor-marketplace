import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '@/context/AppContext';
import { mockUsers } from '@/data/mockData';
import { Zap, Moon, Sun, Menu, ChevronDown, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Navbar() {
  const { currentUser, setCurrentUser, darkMode, toggleDarkMode } = useContext(AppContext);
  const navigate = useNavigate();

  const handleUserSwitch = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (user.role === 'admin') navigate('/dashboard/admin');
      else if (user.role === 'provider') navigate('/dashboard/provider');
      else navigate('/dashboard/customer');
    }
  };

  const getDashboardLink = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'admin') return '/dashboard/admin';
    if (currentUser.role === 'provider') return '/dashboard/provider';
    return '/dashboard/customer';
  };

  const navLinks = (
    <>
      <Link to="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        Browse Services
      </Link>
      <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
        How It Works
      </a>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block text-lg">ServiceHub</span>
          </Link>
          <div className="hidden md:flex gap-6 items-center">{navLinks}</div>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hidden md:flex">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {currentUser ? (
            <div className="hidden md:flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    <span className="max-w-[100px] truncate">{currentUser.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded capitalize">{currentUser.role}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Switch Demo User</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {mockUsers.map(u => (
                    <DropdownMenuItem key={u.id} onClick={() => handleUserSwitch(u.id)}>
                      <div className="flex flex-col">
                        <span className="font-medium">{u.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">{u.role}</span>
                      </div>
                      {u.id === currentUser.id && <Zap className="ml-auto h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => { setCurrentUser(null); navigate('/'); }} className="text-destructive focus:bg-destructive/10">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={() => navigate(getDashboardLink())}>Dashboard</Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    Demo Login <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Select Demo User</DropdownMenuLabel>
                  {mockUsers.map(u => (
                    <DropdownMenuItem key={u.id} onClick={() => handleUserSwitch(u.id)}>
                      {u.name} ({u.role})
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" onClick={() => navigate('/login')}>Log In</Button>
              <Button onClick={() => navigate('/register')}>Register</Button>
            </div>
          )}

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="icon"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-6">
                <Link to="/" className="flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">ServiceHub</span>
                </Link>
                <div className="flex flex-col gap-4">{navLinks}</div>
                <div className="border-t border-border pt-4 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                      {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                  </div>
                  {currentUser ? (
                    <>
                      <div className="flex items-center gap-3 py-2">
                        <Avatar>
                          <AvatarImage src={currentUser.avatar} />
                          <AvatarFallback><UserIcon /></AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{currentUser.name}</span>
                          <span className="text-xs text-muted-foreground capitalize">{currentUser.role}</span>
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => navigate(getDashboardLink())}>Dashboard</Button>
                      <Button variant="outline" className="w-full" onClick={() => { setCurrentUser(null); navigate('/'); }}>Log out</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>Log In</Button>
                      <Button className="w-full" onClick={() => navigate('/register')}>Register</Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
