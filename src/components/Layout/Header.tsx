import React from 'react';
import { Search, Bell, Menu, X } from 'lucide-react';
import { User } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IMAGES } from '../../assets/index';
import { useQuery } from '@tanstack/react-query';
// import { getAllProperty } from '../../actions/property';
import { notificationList } from '../../actions/common';

interface HeaderProps {
  user: User;
  onMenuToggle: () => void;
  customUser: any;
}

export interface PropertySearch {
  search?: string;
}

const defaultFilter: PropertySearch = {
  search: "",
};

export const Header: React.FC<HeaderProps> = ({ user, onMenuToggle, customUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [selectedValue, setSelectedValue] = React.useState<string>("");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [propertySearch, setPropertySearch] = React.useState<PropertySearch>(defaultFilter);

  const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim()) {
        setSearchParams({ search: searchTerm });
      } else {
        searchParams.delete("search");
        setSearchParams(searchParams);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // const { data: property, isLoading, isFetching } = useQuery({
  //   queryKey: ["allProperty", propertySearch],
  //   queryFn: () => getAllProperty({ ...propertySearch }),
  //   staleTime: 5 * 60 * 1000,
  //   refetchOnWindowFocus: false,
  //   // 1. Only run if path is correct AND search term is not empty
  //   enabled:
  //     location.pathname === '/explore-properties' &&
  //     !!propertySearch.search?.trim(),
  // });

  const { data: notificationData, isLoading: isNotificationLoading } = useQuery({
    queryKey: ['notification-list'],
    queryFn: () => notificationList(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  // console.log(notificationList, "<---notificationList")
  const notifications: any[] = notificationData?.result?.data ?? [];

  const handleLogout = () => {
    logout();
    navigate("/login")
  }
  const handleNavigate = () => {
    navigate("/profile")
    setSelectedValue("");
  }

  const handleClear = () => {
    setSearchTerm("");
    setPropertySearch({ search: "" });
  };

  // const notificationData = [
  //   {
  //     "_id": "69b2dc0de0b9bbcc1bb75e3e",
  //     "title": "New Property",
  //     "message": "New Property{Property Ronak}",
  //     "created_at": "2026-03-12",
  //     "status": "UNREAD",
  //     "member_id": null,
  //     "group_owner_id": null,
  //     "user_id": "6908f8a4e648fa1e6f072348",
  //     "__v": 0
  //   },
  //   {
  //     "_id": "69a93417e0b9bbcc1bb732d8",
  //     "title": "New Property",
  //     "message": "New Property{Property WS House}",
  //     "created_at": "2026-03-05",
  //     "status": "UNREAD",
  //     "member_id": null,
  //     "group_owner_id": null,
  //     "user_id": "6908f8a4e648fa1e6f072348",
  //     "__v": 0
  //   },
  //   {
  //     "_id": "69a93179e0b9bbcc1bb73195",
  //     "title": "New Property",
  //     "message": "New Property{Property 5.3.26}",
  //     "created_at": "2026-03-05",
  //     "status": "UNREAD",
  //     "member_id": null,
  //     "group_owner_id": null,
  //     "user_id": "6908f8a4e648fa1e6f072348",
  //     "__v": 0
  //   },
  //   {
  //     "_id": "69a16542c582ec80349c2cb1",
  //     "title": "New Property",
  //     "message": "New Property{Property Manager Ronak}",
  //     "created_at": "2026-02-27",
  //     "status": "UNREAD",
  //     "member_id": null,
  //     "group_owner_id": null,
  //     "user_id": "6908f8a4e648fa1e6f072348",
  //     "__v": 0
  //   },
  //   {
  //     "_id": "699f03f6c582ec80349bd6be",
  //     "title": "New Property",
  //     "message": "New Property{Very new Property}",
  //     "created_at": "2026-02-25",
  //     "status": "UNREAD",
  //     "member_id": null,
  //     "group_owner_id": null,
  //     "user_id": "6908f8a4e648fa1e6f072348",
  //     "__v": 0
  //   },
  //   {
  //     "_id": "699db71f28482bfd64f2b9c6",
  //     "title": "New Property",
  //     "message": "New Property{New town flat}",
  //     "created_at": "2026-02-24",
  //     "status": "UNREAD",
  //     "member_id": null,
  //     "group_owner_id": null,
  //     "user_id": "6908f8a4e648fa1e6f072348",
  //     "__v": 0
  //   },
  //   {
  //     "_id": "699da73628482bfd64f2b7bf",
  //     "title": "New Property",
  //     "message": "New Property{propt 8765432}",
  //     "created_at": "2026-02-24",
  //     "status": "UNREAD",
  //     "member_id": null,
  //     "group_owner_id": null,
  //     "user_id": "6908f8a4e648fa1e6f072348",
  //     "__v": 0
  //   },
  //   {
  //     "_id": "699d990128482bfd64f2b649",
  //     "title": "New Property",
  //     "message": "New Property{ot oea}",
  //     "created_at": "2026-02-24",
  //     "status": "UNREAD",
  //     "member_id": null,
  //     "group_owner_id": null,
  //     "user_id": "6908f8a4e648fa1e6f072348",
  //     "__v": 0
  //   }
  // ]

  return (
    // <header className=" bg-white border-b border-gray-200 px-4 py-3 lg:px-6 fixed top-0 z-10 left-[25%] w-[75%]" >
    <div className="flex bg-white items-center justify-end">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden mr-auto p-2 rounded-md hover:bg-gray-100"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        {location.pathname === '/explore-properties' && (
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search properties..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {/* {(isLoading || isFetching) && searchTerm && (
                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              )} */}

              {searchTerm && (
                <button
                  onClick={handleClear}
                  className="p-0.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* User section */}
      <div className="flex items-center space-x-4">

        {/* Notifications */}
        {!isNotificationLoading ? <div className="flex bg-white items-center justify-end">
          <div className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Select
              onValueChange={(value) => {
                console.log("Selected notification ID:", value);
                // Add navigation or mark as read logic here
              }}
            >
              <SelectTrigger
                className="border-0 bg-transparent focus:ring-0 p-0 h-auto shadow-none"
                arrow={false}
              >
                <div className="relative p-2">
                  <Bell className="w-5 h-5" />
                  {/* Show red dot only if there are unread notifications */}
                  {notifications.length > 0 && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </div>
              </SelectTrigger>

              <SelectContent align="end" sideOffset={8} className="w-80">
                <div className="px-2 py-2 font-semibold text-sm border-b mb-1">
                  Notifications
                </div>

                {notifications.length > 0 ? (
                  <>
                    {notifications.slice(0, 20).map((notif: any) => (
                      <SelectItem
                        key={notif._id}
                        value={notif._id}
                        className="cursor-pointer py-3"
                      >
                        <div className="flex flex-col gap-1 items-start">
                          <span className="font-medium text-gray-900 line-clamp-1">
                            {notif.title}
                          </span>
                          <span className="text-xs text-gray-500 line-clamp-2 text-left">
                            {notif.message}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {notif.created_at}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                    }
                    <div
                      className="p-3 text-center border-t cursor-pointer hover:bg-gray-50"
                      onClick={() =>  navigate('/notification')}
                    >
                      <span className="text-sm font-semibold text-blue-600">
                        View all notifications
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No new notifications
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>
        </div> : null}

        {/* <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="w-5 h-5" />
          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        </button> */}

        {/* User profile */}
        <div className="flex items-center space-x-3">
          {customUser?.role !== "GUEST" && (
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{`${customUser?.first_name} ${customUser?.last_name}`}</p>
              <p className="text-xs text-gray-500">{customUser?.email}</p>
            </div>
          )}
          <div className="relative">
            <Select
              value={selectedValue}
              onValueChange={(value) => {
                if (value === "logout") handleLogout();
                else if (value === "profile") handleNavigate();
              }}
            >
              <SelectTrigger
                className="border-0 bg-transparent focus:ring-0 p-0 h-auto  shadow-none"
                arrow={true}
              >
                <div className="relative">
                  <img
                    src={customUser?.avatar || IMAGES.user_img}
                    alt={customUser?.first_name + " " + customUser?.last_name}
                    className="w-8 h-8 rounded-full object-cover border border-border"
                  />
                  {user?.status === "online" && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                {customUser?.role && (
                  <span className="px-3">{customUser?.role}</span>
                )}
              </SelectTrigger>

              <SelectContent align="end" sideOffset={8} className="w-40">
                {customUser?.role !== "GUEST" && (
                  <SelectItem value="profile">Profile</SelectItem>
                )}
                <SelectItem value="logout">Logout</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
    // </header>
  );
};
