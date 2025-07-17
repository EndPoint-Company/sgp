import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Calendar,
  HelpCircle,
  Settings,
  Menu,
  LogOut,
} from "lucide-react";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const settingsMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { label: "Início", icon: Home, to: "/student/home" },
    { label: "Atendimentos", icon: LayoutDashboard, to: "/student/appointments" },
    { label: "Agenda", icon: Calendar, to: "/student/schedule" },
  ];

  const bottomItems = [
    { label: "Ajuda", icon: HelpCircle, to: "/student/help" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    // alert("Usuário deslogado!");
    navigate("/login");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
        setIsSettingsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [settingsMenuRef]);

  return (
    <div className="flex h-screen bg-white">
      <aside
        className={`bg-white flex flex-col border-r border-gray-200 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Topo */}
        <div className="px-4 pt-4 pb-2 flex flex-col gap-3">
          {collapsed ? (
            <>
              <div className="flex justify-center">
                <button
                  onClick={() => setCollapsed(false)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <Menu size={20} />
                </button>
              </div>
              <div className="flex justify-center mt-2">
                <img
                  src="https://i.pravatar.cc/40?u=marcos"
                  alt="Avatar"
                  className="w-9 h-9 rounded-full"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="https://i.pravatar.cc/40?u=marcos"
                  alt="Avatar"
                  className="w-9 h-9 rounded-full"
                />
                <div className="leading-tight">
                  <h2 className="font-semibold text-sm">Marcos Vitor</h2>
                  <p className="text-xs text-gray-500">Paciente</p>
                </div>
              </div>
              <button
                onClick={() => setCollapsed(true)}
                className="text-gray-500 hover:text-gray-800"
              >
                <Menu size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Menu principal */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <nav className="flex flex-col gap-1">
            {navItems.map(({ label, icon: Icon, to }) => {
              const active = isActive(to);
              return (
                <Link
                  key={label}
                  to={to}
                  className={`flex items-center px-3 py-2.5 rounded-md text-sm transition-all ${
                    active
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } ${collapsed ? "justify-center" : "gap-3"}`}
                >
                  <Icon
                    size={18}
                    className={active ? "text-blue-600" : "text-gray-500"}
                  />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Rodapé */}
        <div className="px-4 py-4 border-t border-gray-200 relative">
          
          {/* Menu de Sair que aparece e desaparece */}
          {isSettingsMenuOpen && (
            <div ref={settingsMenuRef} className="absolute bottom-full left-4 right-4 mb-[-53px] bg-white border border-gray-200 rounded-lg shadow-md p-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center text-gray-700 px-3 py-2 rounded-md hover:bg-gray-100 text-sm gap-3"
              >
                <LogOut size={16} />
                {!collapsed && "Sair"}
              </button>
            </div>
          )}

          <nav className="flex flex-col gap-1">
            {bottomItems.map(({ label, icon: Icon, to }) => (
                <Link
                  key={label}
                  to={to}
                  className={`flex items-center px-3 py-2.5 rounded-md text-sm transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${
                    collapsed ? "justify-center" : "gap-3"
                  }`}
                >
                  <Icon size={18} className="text-gray-500" />
                  {!collapsed && label}
                </Link>
            ))}
            
            <button
              onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
              className={`flex items-center px-3 py-2.5 rounded-md text-sm transition-all w-full ${
                isSettingsMenuOpen ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              } ${collapsed ? "justify-center" : "gap-3"}`}
            >
              <Settings size={18} className="text-gray-500" />
              {!collapsed && "Configurações"}
            </button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 bg-gray-50 p-8 overflow-y-auto rounded-tl-2xl">
        {children}
      </main>
    </div>
  );
}