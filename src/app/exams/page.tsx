"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaClipboardCheck,
  FaFileAlt,
  FaUserGraduate,
} from "react-icons/fa";

// Mock data
const mockExams = [
  {
    id: "1001",
    name: "Kỳ thi sát hạch B1 tháng 6/2023",
    examDate: "15/06/2023",
    examTime: "08:00",
    location: "Trung tâm sát hạch lái xe Hà Nội",
    licenseType: "B1",
    candidates: 30,
    passedCount: 25,
    status: "Đã hoàn thành",
  },
  {
    id: "1002",
    name: "Kỳ thi sát hạch A1 tháng 6/2023",
    examDate: "20/06/2023",
    examTime: "08:00",
    location: "Trung tâm sát hạch lái xe Hà Nội",
    licenseType: "A1",
    candidates: 45,
    passedCount: 40,
    status: "Đã hoàn thành",
  },
  {
    id: "1003",
    name: "Kỳ thi sát hạch B2 tháng 7/2023",
    examDate: "10/07/2023",
    examTime: "08:00",
    location: "Trung tâm sát hạch lái xe Hà Nội",
    licenseType: "B2",
    candidates: 25,
    passedCount: 0,
    status: "Đang diễn ra",
  },
  {
    id: "1004",
    name: "Kỳ thi sát hạch A2 tháng 7/2023",
    examDate: "15/07/2023",
    examTime: "08:00",
    location: "Trung tâm sát hạch lái xe Hà Nội",
    licenseType: "A2",
    candidates: 35,
    passedCount: 0,
    status: "Chưa diễn ra",
  },
  {
    id: "1005",
    name: "Kỳ thi sát hạch B1 tháng 8/2023",
    examDate: "05/08/2023",
    examTime: "08:00",
    location: "Trung tâm sát hạch lái xe Hà Nội",
    licenseType: "B1",
    candidates: 0,
    passedCount: 0,
    status: "Chưa diễn ra",
  },
];

export default function ExamManagement() {
  const [exams, setExams] = useState(mockExams);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);

  const filteredExams = exams.filter(
    (exam) =>
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.id.includes(searchTerm) ||
      exam.licenseType.includes(searchTerm)
  );

  const handleNewExam = () => {
    setSelectedExam(null);
    setIsModalOpen(true);
  };

  const handleEditExam = (exam: any) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  function getStatusColor(status: string) {
    switch (status) {
      case "Đã hoàn thành":
        return "bg-green-100 text-green-800";
      case "Đang diễn ra":
        return "bg-yellow-100 text-yellow-800";
      case "Chưa diễn ra":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <DashboardLayout title="Quản lý kỳ thi">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full md:w-80 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="Tìm kiếm kỳ thi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleNewExam}
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Tạo kỳ thi mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-blue-100 p-3 mr-4">
            <FaClipboardCheck className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tổng số kỳ thi</p>
            <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <FaUserGraduate className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Tổng thí sinh đăng ký</p>
            <p className="text-2xl font-bold text-gray-900">
              {exams.reduce((sum, exam) => sum + exam.candidates, 0)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <FaFileAlt className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Thí sinh đỗ</p>
            <p className="text-2xl font-bold text-gray-900">
              {exams.reduce((sum, exam) => sum + exam.passedCount, 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã kỳ thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên kỳ thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày thi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hạng GPLX
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số thí sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đỗ/Trượt
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
              {filteredExams.map((exam) => (
                <tr key={exam.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {exam.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.examDate} {exam.examTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.licenseType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.candidates}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.passedCount}/{exam.candidates - exam.passedCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        exam.status
                      )}`}
                    >
                      {exam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Chỉnh sửa"
                        onClick={() => handleEditExam(exam)}
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
                {selectedExam ? "Chỉnh sửa kỳ thi" : "Tạo kỳ thi mới"}
              </h3>
            </div>
            <div className="p-6">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Tên kỳ thi
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      defaultValue={selectedExam?.name || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại bằng lái
                    </label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900">
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
                      Số lượng thí sinh dự kiến
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      defaultValue={selectedExam?.candidates || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày thi
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Giờ thi
                    </label>
                    <input
                      type="time"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Địa điểm thi
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      defaultValue={selectedExam?.location || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng thái
                    </label>
                    <select
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      defaultValue={selectedExam?.status || "Chưa diễn ra"}
                    >
                      <option value="Chưa diễn ra">Chưa diễn ra</option>
                      <option value="Đang diễn ra">Đang diễn ra</option>
                      <option value="Đã hoàn thành">Đã hoàn thành</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số thí sinh đỗ
                    </label>
                    <input
                      type="number"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      defaultValue={selectedExam?.passedCount || "0"}
                    />
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
                className="py-2 px-4 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                onClick={() => setIsModalOpen(false)}
              >
                {selectedExam ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
