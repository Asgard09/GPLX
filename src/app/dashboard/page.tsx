"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaClipboardList,
  FaIdCard,
  FaSpinner,
} from "react-icons/fa";
import Link from "next/link";
import {
  dashboardService,
  DashboardStats,
  RecentExam,
  RecentLicense,
} from "@/services/dashboardService";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeCourses: 0,
    upcomingExams: 0,
    issuedLicenses: 0,
  });
  const [recentExams, setRecentExams] = useState<RecentExam[]>([]);
  const [recentLicenses, setRecentLicenses] = useState<RecentLicense[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard statistics
        const dashboardStats = await dashboardService.getDashboardStats();
        setStats(dashboardStats);

        // Fetch recent exams
        const examsData = await dashboardService.getRecentExams(4);
        setRecentExams(examsData);

        // Fetch recent licenses
        const licensesData = await dashboardService.getRecentLicenses(4);
        setRecentLicenses(licensesData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: "Học Viên",
      icon: <FaGraduationCap className="w-6 h-6 text-blue-500" />,
      stat: stats.totalStudents.toString(),
      description: "Tổng số học viên đăng ký",
      link: "/students",
    },
    {
      title: "Khóa Học",
      icon: <FaChalkboardTeacher className="w-6 h-6 text-green-500" />,
      stat: stats.activeCourses.toString(),
      description: "Khóa học đang mở",
      link: "/courses",
    },
    {
      title: "Kỳ Thi",
      icon: <FaClipboardList className="w-6 h-6 text-yellow-500" />,
      stat: stats.upcomingExams.toString(),
      description: "Kỳ thi sắp tới",
      link: "/exams",
    },
    {
      title: "Giấy Phép",
      icon: <FaIdCard className="w-6 h-6 text-purple-500" />,
      stat: stats.issuedLicenses.toString(),
      description: "Giấy phép đã cấp",
      link: "/licenses",
    },
  ];

  // Helper to render the status badge for exams
  const renderExamStatusBadge = (status: string) => {
    let bgColor = "bg-blue-100 text-blue-800";

    switch (status) {
      case "Hoàn thành":
      case "Đã hoàn thành":
        bgColor = "bg-green-100 text-green-800";
        break;
      case "Đang diễn ra":
        bgColor = "bg-yellow-100 text-yellow-800";
        break;
      default:
        bgColor = "bg-blue-100 text-blue-800";
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${bgColor}`}>
        {status}
      </span>
    );
  };

  // Format the date string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Bảng điều khiển">
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="w-8 h-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </DashboardLayout>
    );
  }

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
          {recentExams.length > 0 ? (
            <div className="space-y-3">
              {recentExams.map((exam) => (
                <div key={exam.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{exam.title}</p>
                      <p className="text-sm text-gray-500">
                        {formatDate(exam.date)}
                      </p>
                    </div>
                    {renderExamStatusBadge(exam.status)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Không có kỳ thi nào sắp tới</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Cấp GPLX gần đây
          </h3>
          {recentLicenses.length > 0 ? (
            <div className="space-y-3">
              {recentLicenses.map((license) => (
                <div key={license.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        {license.studentName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {license.licenseNumber}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(license.issueDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Không có giấy phép nào được cấp gần đây
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
