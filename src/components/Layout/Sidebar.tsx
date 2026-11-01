import React, { useEffect, useState } from "react";
import {
  Home,
  Building,
  List,
  MessageCircle,
  Star,
  Calendar,
  HelpCircle,
  FileQuestion,
  ClipboardCheck,
  History,
  Shield,
  Settings,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { NavigationItem } from "../types";
import { useAuth } from "../../context/AuthContext";
import {
  adminSidebar,
  guestSidebar,
  landLordSidebar,
  propertyManagerSidebar,
  tanentSidebar,
} from "../../commonJSONs/sidebar";
import { IMAGES } from "../../assets/index";
import Icon from "../icons/icon";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

// const navigationItems: NavigationItem[] = [
//   { id: 'dashboard', url: "/dashboard", label: 'Dashboard', icon: 'Home', active: true },
//   { id: 'explore-properties', url: "/explore-properties", label: 'Explore Properties', icon: 'Building' },
//   { id: 'list', url: "/my-post", label: 'My Post', icon: 'List' },
//   { id: 'chat', url: "", label: 'Chat', icon: 'MessageCircle' },
//   { id: 'reviews', url: "", label: 'Reviews', icon: 'Star' },
//   { id: 'schedule', url: "", label: 'Schedule Visit', icon: 'Calendar', hasNotification: true },
//   { id: 'help', url: "", label: 'Help Center', icon: 'HelpCircle' },
//   { id: 'faq', url: "/faqs", label: 'FAQ', icon: 'FileQuestion' },
//   { id: 'guidelines', url: "", label: 'Property Guidelines', icon: 'ClipboardCheck' },
//   { id: 'booking', url: "", label: 'Booking History', icon: 'History' },
//   { id: 'privacy', url: "", label: 'Privacy Policy', icon: 'Shield' },
// ];

const iconMap = {
  Home,
  Building,
  List,
  MessageCircle,
  Star,
  Calendar,
  HelpCircle,
  FileQuestion,
  ClipboardCheck,
  History,
  Shield,
  Settings,
};

const filterPermissions = (data: any) => {
  return data
    .map((item: any) => {
      // 1. If there are children, filter them first
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterPermissions(item.children);

        // Return a copy of the item with the new children list
        return { ...item, children: filteredChildren.length > 0 ? filteredChildren : null };
      }

      // 2. If no children (or children were null), return the item as is for the next step
      return item;
    })
    .filter((item: any) => {
      // 3. Final Exclusion Logic:
      // Keep if: it has children OR its own view permission is true
      const hasChildren = item.children && item.children.length > 0;
      const hasViewPermission = item.permission?.view === true;

      return hasChildren || hasViewPermission;
    });
};

// const sanitizedPermissions = filterPermissions(adminPermissionRaw);
// console.log(sanitizedPermissions);


export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onNavigate }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [SidebarContents, setSidebarContents] = useState<any[]>([]);
  const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // console.log("user role ::: ", user, user?.role)
    const adminPermissionRaw = localStorage.getItem("permission");
    // console.log(adminPermissionRaw, "<--admin per");

    const adminPermission = adminPermissionRaw
      ? JSON.parse(adminPermissionRaw)
      : [];

    const sanitizedPermissions = filterPermissions(adminPermission);
    const sanitizedPermissions2 = [sanitizedPermissions];
    console.log(sanitizedPermissions);


    switch (user?.role) {
      case "LANDLORD":
        setSidebarContents(landLordSidebar ?? []);
        break;
      case "SUPER ADMIN":
        setSidebarContents(adminSidebar ?? []);
        break;
      case "ADMIN":
        setSidebarContents(sanitizedPermissions2 ?? []);
        break;
      case "TENANT":
        setSidebarContents(tanentSidebar ?? []);
        break;
      case "PROPERTY MANAGER":
        setSidebarContents(propertyManagerSidebar ?? []);
        break;
      case "GUEST":
        setSidebarContents(guestSidebar ?? []);
        break;
      default:
        setSidebarContents([]);
    }
  }, [user]);

  const toggleSubmenu = (
    e: React.MouseEvent,
    id: number,
    hasChildren: boolean,
  ) => {
    if (hasChildren) {
      e.preventDefault(); // Prevent navigation if it's just a dropdown toggle
      setOpenMenus((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  const isChildActive = (path: string) => {
    // Simple exact match — upgrade to startsWith if you want nested route highlighting
    return location.pathname === path;
    // Alternative (better for sub-routes):
    // return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className=" flex flex-col gap-2 ">
        <div className="py-2 mx-[20px] border-b border-border">
          <img src={IMAGES?.logo2} alt="Rentmatch logo" className="relative w-[140px] h-[35px] md:w-[150px] md:h-[30px] object-contain" />
        </div>
        <div className="py-2 px-[20px] h-[calc(100dvh-73px)] overflow-y-auto thin-scrollbar ">
          <div className="flex flex-col gap-1">
            {SidebarContents?.map((section: any[], index) => (
              <div
                key={index}
                className={`py-6 first:pt-0 first:border-b border-border flex flex-col gap-2 last:mb-3`}
              >
                {section?.map(
                  (item, i) => {
                    const hasChildren =
                      !!item.children && item.children.length > 0;
                    const isExpanded = !!openMenus[item.id];
                    const isActive = location.pathname === item.to;

                    return (
                      <li key={"" + index + i} className="list-none">
                        <Link
                          to={hasChildren ? "#" : item.to}
                          onClick={(e) => {
                            toggleSubmenu(e, item.id, hasChildren);
                            if (!hasChildren) onNavigate?.();
                          }}
                          className={`flex items-center justify-between px-3 py-2 rounded-md transition-all ${isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-muted-foreground hover:bg-accent"
                            }`}
                        >
                          <div className="flex gap-3 items-center">
                            <Icon
                              name={item?.icon}
                              fill="none"
                              className="w-4 h-4 text-primary"
                            />
                            <span className="font-medium tracking-tight text-base">
                              {item?.title}
                            </span>
                          </div>

                          {hasChildren && (
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                            />
                          )}
                        </Link>

                        {/* Collapsible children Section */}
                        {hasChildren && (
                          <ul
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-96 mt-1" : "max-h-0"}`}
                          >
                            {item.children.map(
                              (childItem: any, indx: number) => {
                                const childActive = isChildActive(childItem.to);
                                return (
                                  <li key={indx} className="ml-6">
                                    <Link
                                      to={childItem?.to}
                                      onClick={() => onNavigate?.()}
                                      className={`flex gap-3 items-center py-2 px-3 rounded-md text-sm hover:text-primary transition-colors 
                                ${childActive
                                          ? "text-primary font-medium bg-primary/5"
                                          : "text-muted-foreground hover:text-primary hover:bg-accent"
                                        // location.pathname === childItem.to ? 'text-primary font-medium' : 'text-muted-foreground'
                                        }`}
                                    >
                                      <Icon
                                        name={childItem?.icon}
                                        fill="none"
                                        className="w-3 h-3"
                                      />
                                      <span>{childItem?.title}</span>
                                    </Link>
                                  </li>
                                );
                              },
                            )}
                          </ul>
                        )}
                      </li>
                    );
                  },

                  //   <li key={""+index+i} className='list-none ' onClick={openChildren}>
                  //     <Link to={item.to}
                  //     //  className={`decoration-none flex gap-3 items-center`}
                  //     className={`decoration-none flex gap-3 items-center px-3 py-2 rounded-md transition-colors ${
                  //             location.pathname === item.to
                  //               ? 'bg-primary/10 text-primary font-semibold'
                  //               : 'text-muted-foreground hover:bg-muted/50'
                  //           }`}
                  //       >
                  //     <div>
                  //       <Icon name={item?.icon} fill="none" className='w-4 h-4 text-primary' />
                  //     </div>
                  //   <div className='font-medium tracking-tight text-base text-muted-foreground flex items-center justify-between'>
                  //     <span>{item?.title}</span>
                  //     {item?.children && <Icon name="ChevronDown" /> }
                  //   </div>
                  // </Link>
                  // {!!item?.children &&
                  // <ul>
                  //   {item?.children?.map((childItem : any, indx: number) =>
                  //   <li key={indx} className='py-3 border-b border-border'>
                  //     <Link to={childItem?.to} className='flex gap-3 items-center'>
                  //       <Icon name={childItem?.icon} fill="none" className='w-4 h-4 text-primary' />
                  //       <span>{childItem?.title}</span>
                  //     </Link>
                  //   </li>
                  //   )}
                  // </ul>
                  // }
                  // </li>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

{
  /* Sidebar */
}
// <div className={`
//   h-full w-full bg-white shadow-lg transform
//   lg:translate-x-0 lg:static lg:shadow-none
// `}>
//   {/* Header */}
//   <div className="flex items-center justify-between p-4 border-b">
//     <div className="flex items-center space-x-2">
//       <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
//         <Home className="w-5 h-5 text-white" />
//       </div>
//       <span className="text-xl font-bold text-gray-800">RentMatch</span>
//     </div>
//     <button
//       onClick={onToggle}
//       className="lg:hidden p-1 rounded-md hover:bg-gray-100"
//     >
//       <X className="w-5 h-5" />
//     </button>
//   </div>

//   {/* Navigation */}
//   <nav className="pt-4 pl-4 pb-4 space-y-1">
//     {navigationItems.map((item) => {
//       const IconComponent = iconMap[item.icon as keyof typeof iconMap];
//       return (
//         <a
//           key={item.id}
//           href={item.url}
//           className={`
//             flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
//             ${item.active
//               ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
//               : 'text-gray-600 hover:bg-accent hover:text-gray-900'
//             }
//           `}
//         >
//           <IconComponent className="w-5 h-5" />
//           <span className="flex-1">{item.label}</span>
//           {item.hasNotification && (
//             <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//           )}
//         </a>
//       );
//     })}
//   </nav>

//   {/* Settings */}
//   <div className="absolute bottom-4 left-4 right-4">
//     <a
//       href="#"
//       className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-accent hover:text-gray-900 transition-colors"
//     >
//       <Settings className="w-5 h-5" />
//       <span>Settings</span>
//     </a>
//   </div>
// </div>
