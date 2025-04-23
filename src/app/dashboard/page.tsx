"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaClipboardList,
  FaIdCard,
} from "react-icons/fa";
import Link from "next/link";

export default function Dashboard() {
  const cards = [
    {
      title: "Học Viên",
      icon: <FaGraduationCap className="w-6 h-6 text-blue-500" />,
      stat: "250",
      description: "Tổng số học viên đăng ký",
      link: "/students",
    },
    {
      title: "Khóa Học",
      icon: <FaChalkboardTeacher className="w-6 h-6 text-green-500" />,
      stat: "12",
      description: "Khóa học đang mở",
      link: "/courses",
    },
    {
      title: "Kỳ Thi",
      icon: <FaClipboardList className="w-6 h-6 text-yellow-500" />,
      stat: "5",
      description: "Kỳ thi sắp tới",
      link: "/exams",
    },
    {
      title: "Giấy Phép",
      icon: <FaIdCard className="w-6 h-6 text-purple-500" />,
      stat: "180",
      description: "Giấy phép đã cấp",
      link: "/licenses",
    },
  ];

  return (
    <DashboardLayout title="Bảng điều khiển">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <Link key={index} href={card.link}>
            <div className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {card.title}
                  </h3>
                  <p className="text-3xl font-bold mt-2 text-gray-900">
                    {card.stat}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {card.description}
                  </p>
                </div>
                <div className="bg-gray-100 p-3 rounded-full">{card.icon}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Lịch kỳ thi gần đây
          </h3>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      Kỳ thi B1 #{i + 1}
                    </p>
                    <p className="text-sm text-gray-500">{`${
                      10 + i
                    }/06/2023 - 08:00 AM`}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      i === 0
                        ? "bg-green-100 text-green-800"
                        : i === 1
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {i === 0
                      ? "Hoàn thành"
                      : i === 1
                      ? "Đang diễn ra"
                      : "Sắp diễn ra"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cấp GPLX gần đây
          </h3>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border-b pb-3 last:border-0">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">
                      Nguyễn Văn {String.fromCharCode(65 + i)}
                    </p>
                    <p className="text-sm text-gray-500">
                      GPLX B1 - {`${1000 + i}`}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">{`${
                    5 + i
                  }/06/2023`}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
