"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserPlus,
  FaCalendarAlt,
} from "react-icons/fa";

// Mock data
const mockCourses = [
  {
    id: "101",
    name: "Khóa đào tạo lái xe hạng B1",
    startDate: "01/06/2023",
    endDate: "30/07/2023",
    students: 35,
    instructors: 2,
    status: "Đang diễn ra",
  },
  {
    id: "102",
    name: "Khóa đào tạo lái xe hạng A1",
    startDate: "15/06/2023",
    endDate: "15/07/2023",
    students: 40,
    instructors: 2,
    status: "Đang diễn ra",
  },
  {
    id: "103",
    name: "Khóa đào tạo lái xe hạng B2",
    startDate: "01/08/2023",
    endDate: "15/09/2023",
    students: 25,
    instructors: 3,
    status: "Sắp diễn ra",
  },
  {
    id: "104",
    name: "Khóa đào tạo lái xe hạng A2",
    startDate: "01/04/2023",
    endDate: "15/05/2023",
    students: 30,
    instructors: 1,
    status: "Đã kết thúc",
  },
  {
    id: "105",
    name: "Khóa đào tạo lái xe hạng C",
    startDate: "15/04/2023",
    endDate: "30/06/2023",
    students: 20,
    instructors: 2,
    status: "Đã kết thúc",
  },
];

export default function CourseManagement() {
  const [courses, setCourses] = useState(mockCourses);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.id.includes(searchTerm)
  );

  const handleNewCourse = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: any) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  function getStatusColor(status: string) {
    switch (status) {
      case "Đang diễn ra":
        return "bg-green-100 text-green-800";
      case "Sắp diễn ra":
        return "bg-blue-100 text-blue-800";
      case "Đã kết thúc":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <DashboardLayout title="Quản lý đào tạo">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full md:w-80 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleNewCourse}
          className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          <FaPlus className="mr-2" />
          Tạo khóa học mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Tổng quan khóa học
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tổng số khóa học</span>
              <span className="font-semibold">{courses.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Đang diễn ra</span>
              <span className="font-semibold">
                {courses.filter((c) => c.status === "Đang diễn ra").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Sắp diễn ra</span>
              <span className="font-semibold">
                {courses.filter((c) => c.status === "Sắp diễn ra").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Đã kết thúc</span>
              <span className="font-semibold">
                {courses.filter((c) => c.status === "Đã kết thúc").length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Thống kê học viên
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tổng số học viên</span>
              <span className="font-semibold">
                {courses.reduce((sum, course) => sum + course.students, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Học viên đang học</span>
              <span className="font-semibold">
                {courses
                  .filter((c) => c.status === "Đang diễn ra")
                  .reduce((sum, course) => sum + course.students, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Học viên sắp vào học</span>
              <span className="font-semibold">
                {courses
                  .filter((c) => c.status === "Sắp diễn ra")
                  .reduce((sum, course) => sum + course.students, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Học viên đã hoàn thành</span>
              <span className="font-semibold">
                {courses
                  .filter((c) => c.status === "Đã kết thúc")
                  .reduce((sum, course) => sum + course.students, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên khóa học
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Học viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giáo viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {course.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.startDate} - {course.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.students}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {course.instructors}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        course.status
                      )}`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Phân công giáo viên"
                      >
                        <FaUserPlus />
                      </button>
                      <button
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Quản lý lịch học"
                      >
                        <FaCalendarAlt />
                      </button>
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Chỉnh sửa"
                        onClick={() => handleEditCourse(course)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedCourse ? "Chỉnh sửa khóa học" : "Tạo khóa học mới"}
              </h3>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Tên khóa học
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      defaultValue={selectedCourse?.name || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại bằng lái
                    </label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                      <option value="">Chọn loại bằng lái</option>
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số lượng học viên tối đa
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      defaultValue={selectedCourse?.students || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày bắt đầu
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày kết thúc
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng thái
                    </label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      defaultValue={selectedCourse?.status || "Sắp diễn ra"}
                    >
                      <option value="Sắp diễn ra">Sắp diễn ra</option>
                      <option value="Đang diễn ra">Đang diễn ra</option>
                      <option value="Đã kết thúc">Đã kết thúc</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Học phí (VNĐ)
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Mô tả
                    </label>
                    <textarea
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      rows={3}
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 bg-gray-50 text-right flex justify-end space-x-2">
              <button
                type="button"
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm bg-primary text-sm font-medium text-white hover:bg-blue-600 focus:outline-none"
                onClick={() => setIsModalOpen(false)}
              >
                {selectedCourse ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
