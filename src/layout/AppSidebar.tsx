import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

import {
  //BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  //ListIcon,
  //PieChartIcon,
  TimeIcon,
  UserCircleIcon,
  VideoIcon,
  BoxIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { AlignLeft, Users } from "lucide-react";
import useAuth from "../auth/useAuth";
import CreateMinistryModal from "../components/ministry/CreateMinistryModal";
import httpClient from "../api/httpClient";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { 
    name: string; 
    path?: string; 
    onClick?: () => void;
    pro?: boolean; 
    new?: boolean;
  }[];
};


const AppSidebar: React.FC = () => {
  const { user } = useAuth();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isCreateMinistryModalOpen, setIsCreateMinistryModalOpen] = useState(false);
  const [ministries, setMinistries] = useState<Array<{ id: string; name: string }>>([]);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // Buscar ministérios da API
  const fetchMinistries = useCallback(async () => {
    try {
      const response = await httpClient.get<Array<{ id: string; name: string }>>("/ministeries");
      setMinistries(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar ministérios:", error);
      setMinistries([]);
    }
  }, []);

  // Carregar ministérios ao montar o componente
  useEffect(() => {
    fetchMinistries();
  }, [fetchMinistries]);

  // Definir navItems dentro do componente para ter acesso a ministries
  const navItems: NavItem[] = [
    {
      icon: <GridIcon />,
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: <CalenderIcon />,
      name: "Calendario",
      path: "/calendar",
    },
    {
      icon: <UserCircleIcon />,
      name: "Perfil",
      path: `/profile/${user?.id}`,
    },
    /*{
      name: "Forms",
      icon: <ListIcon />,
      subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
    },*/
    {
      name: "Membros",
      icon: <UserCircleIcon/>,
      subItems: [
        { name: "Todos", path: "/members", pro: false },
        { name: "Baptizados", path: "/baptized-members", pro: false },
        { name: "Não baptizados", path: "/non-baptized-members", pro: false },
        //{ name: "Lideres", path: "/basic-tables", pro: false },
      ],
    },
    {
      name: "Ministérios",
      icon: <UserCircleIcon/>,
      subItems: [
        { name: "Criar Ministério", onClick: () => setIsCreateMinistryModalOpen(true) },
        ...ministries.map((ministry) => ({
          name: ministry.name,
          path: `/ministery/${ministry.id}`,
          pro: false,
        })),
      ],
    },
    {
      name: "Actividades",
      icon: <CalenderIcon/>,
      subItems: [
        { name: "Ver", path: "/events", pro: false },
        { name: "Criar", path: "/register-event", pro: false },
      ],
    },
    {
      name: "Dias de culto",
      icon: <TimeIcon/>,
      subItems: [
        { name: "Ver", path: "/service-days", pro: false },
        { name: "Criar", path: "/register-service-day", pro: false },
      ],
    },
    {
      name: "Pregações",
      icon: <VideoIcon/>,
      subItems: [
        { name: "Ver", path: "/sermons-list", pro: false },
        { name: "Criar", path: "/register-sermon", pro: false },
      ],
    },
    {
      name: "EBD",
      icon: <Users/>,
      subItems: [
        //{ name: "Ver professores", path: "/teachers", pro: false },
        { name: "Ver alunos", path: "/students", pro: false },
        { name: "Criar aluno", path: "/register-student", pro: false },
      ],
    },
    {
      name: "Patrimônio",
      icon: <BoxIcon/>,
      subItems: [
        { name: "Ver patrimônios", path: "/patrimonies", pro: false },
        { name: "Inventário", path: "/inventory", pro: false },
        { name: "Movimentos de patrimônios", path: "/movements", pro: false },
      ],
    },
  ];

const othersItems: NavItem[] = [
  /*{
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  }*/
];

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (subItem.path && isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    {subItem.onClick ? (
                      <button
                        onClick={subItem.onClick}
                        className="menu-dropdown-item menu-dropdown-item-inactive w-full text-left"
                      >
                        {subItem.name}
                      </button>
                    ) : (
                      <Link
                        to={subItem.path || "#"}
                        className={`menu-dropdown-item ${
                          subItem.path && isActive(subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`ml-auto ${
                                subItem.path && isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`ml-auto ${
                                subItem.path && isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`flex ${
          !isExpanded && !isHovered ? "lg:justify-center py-8" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <div>
              <img
                src="/assets/logo.png"
                width={70}
                alt="Logo"
            />
            </div>
          ) : (
            <AlignLeft />
          )}
        </Link>
      </div>
      <div className="pt-8 flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
      <CreateMinistryModal
        isOpen={isCreateMinistryModalOpen}
        onClose={() => setIsCreateMinistryModalOpen(false)}
        onSuccess={fetchMinistries}
      />
    </aside>
  );
};

export default AppSidebar;
