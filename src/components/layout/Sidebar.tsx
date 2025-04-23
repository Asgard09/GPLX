import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaClipboardList,
  FaIdCard,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdSchool } from "react-icons/md";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // Xóa cookie xác thực
    document.cookie =
      "authenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    // Chuyển hướng về trang đăng nhập
    router.push("/");
  };

  const navItems = [
    {
      name: "Nhập thông tin học viên",
      path: "/students",
      icon: <FaUserGraduate className="w-5 h-5" />,
    },
    {
      name: "Quản lý đào tạo",
      path: "/courses",
      icon: <MdSchool className="w-5 h-5" />,
    },
    {
      name: "Quản lý giáo viên",
      path: "/instructors",
      icon: <FaChalkboardTeacher className="w-5 h-5" />,
    },
    {
      name: "Quản lý kỳ thi",
      path: "/exams",
      icon: <FaClipboardList className="w-5 h-5" />,
    },
    {
      name: "Cấp giấy phép",
      path: "/licenses",
      icon: <FaIdCard className="w-5 h-5" />,
    },
  ];

  return (
    <div className="h-screen bg-blue-600 text-white w-64 flex flex-col">
      <div className="p-5 border-b border-blue-500">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full"></div>
          <div className="font-bold text-white">Admin</div>
        </div>
      </div>

      <nav className="flex-1 p-5">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center space-x-3 p-3 rounded-md transition-colors text-white
                  ${
                    pathname === item.path
                      ? "bg-blue-700 text-white"
                      : "hover:bg-blue-700"
                  }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-5 border-t border-blue-500">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-blue-700 transition-colors text-white"
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
