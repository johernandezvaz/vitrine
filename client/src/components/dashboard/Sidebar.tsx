import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  LogOut,
} from 'lucide-react';



interface SidebarProps {
  onLogout: () => void;
}



const Sidebar: FC<SidebarProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');
  

  if (!token) {
      throw new Error("Respuesta inesperada del servidor");
    }

    const userPayload = JSON.parse(atob(token.split(".")[1]));
      console.log(userPayload);


  const getMenuItems = () => {
    const baseItems = [
      {
        icon: LayoutDashboard,
        text: 'Dashboard',
        path: userPayload.identity.role === 'client' ? '/dashboard-client' : '/dashboard-provider',
      },
      {
        icon: FolderKanban,
        text: 'Proyectos',
        path: userPayload.identity.role === 'client' ? '/projects-client' : '/projects-provider',
      },
      {
        icon: MessageSquare,
        text: 'Mensajes',
        path: userPayload.identity.role === 'client' ? '/messages-client' : '/messages-provider',
      },
    ];

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold">Vitrine</h2>
        <p className="text-sm text-gray-400 mt-1">
          {userPayload.identity.role === 'client' ? 'Portal Cliente' : 'Portal Proveedor'}
        </p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;