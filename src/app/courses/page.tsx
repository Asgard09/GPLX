"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { courseService, Course } from "@/services/firebaseService";

// Thêm dữ liệu mẫu
const mockCourses = [
  {
    id: "1001",
    name: "Khóa đào tạo lái xe hạng B1 - Tháng 6/2023",
    licenseType: "B1",
    startDate: "2023-06-01",
    endDate: "2023-08-01",
    maxStudents: 30,
    instructors: 2,
    fee: 12000000,
    status: "Đang diễn ra",
  },
  {
    id: "1002",
    name: "Khóa đào tạo lái xe hạng A1 - Tháng 6/2023",
    licenseType: "A1",
    startDate: "2023-06-15",
    endDate: "2023-07-15",
    maxStudents: 40,
    instructors: 3,
    fee: 4000000,
    status: "Đang diễn ra",
  },
  {
    id: "1003",
    name: "Khóa đào tạo lái xe hạng B2 - Tháng 7/2023",
    licenseType: "B2",
    startDate: "2023-07-01",
    endDate: "2023-09-01",
    maxStudents: 25,
    instructors: 2,
    fee: 15000000,
    status: "Sắp diễn ra",
  },
  {
    id: "1004",
    name: "Khóa đào tạo lái xe hạng A2 - Tháng 7/2023",
    licenseType: "A2",
    startDate: "2023-07-15",
    endDate: "2023-08-15",
    maxStudents: 35,
    instructors: 3,
    fee: 5000000,
    status: "Sắp diễn ra",
  },
  {
    id: "1005",
    name: "Khóa đào tạo lái xe hạng C - Tháng 6/2023",
    licenseType: "C",
    startDate: "2023-06-01",
    endDate: "2023-09-01",
    maxStudents: 20,
    instructors: 4,
    fee: 20000000,
    status: "Đã kết thúc",
  },
];

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<
    Omit<Course, "id" | "createdAt" | "updatedAt">
  >({
    name: "",
    licenseType: "",
    startDate: "",
    endDate: "",
    maxStudents: 0,
    instructors: 0,
    fee: 0,
    status: "Sắp diễn ra",
    description: "",
  });

  // Tải danh sách khóa học từ Firebase
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await courseService.getCourses();
        setCourses(coursesData);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu khóa học:", err);
        setError("Không thể tải dữ liệu khóa học. Sử dụng dữ liệu mẫu.");
        setCourses(mockCourses as Course[]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.id && course.id.includes(searchTerm))
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Xử lý đặc biệt cho các trường số
    if (name === "maxStudents" || name === "instructors" || name === "fee") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleNewCourse = () => {
    setSelectedCourse(null);
    setFormData({
      name: "",
      licenseType: "",
      startDate: "",
      endDate: "",
      maxStudents: 0,
      instructors: 0,
      fee: 0,
      status: "Sắp diễn ra",
      description: "",
    });
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      licenseType: course.licenseType,
      startDate: course.startDate,
      endDate: course.endDate,
      maxStudents: course.maxStudents,
      instructors: course.instructors,
      fee: course.fee,
      status: course.status,
      description: course.description || "",
    });
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleViewCourse = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      licenseType: course.licenseType,
      startDate: course.startDate,
      endDate: course.endDate,
      maxStudents: course.maxStudents,
      instructors: course.instructors,
      fee: course.fee,
      status: course.status,
      description: course.description || "",
    });
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push("Tên khóa học không được để trống");
    if (!formData.licenseType) errors.push("Loại bằng lái không được để trống");
    if (!formData.startDate) errors.push("Ngày bắt đầu không được để trống");
    if (!formData.endDate) errors.push("Ngày kết thúc không được để trống");
    if (formData.maxStudents <= 0)
      errors.push("Số lượng học viên phải lớn hơn 0");
    if (formData.instructors <= 0)
      errors.push("Số lượng giáo viên phải lớn hơn 0");
    if (formData.fee <= 0) errors.push("Học phí phải lớn hơn 0");

    // Kiểm tra ngày kết thúc phải sau ngày bắt đầu ít nhất 7 ngày
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      // Tính số mili giây trong 1 ngày
      const oneDayMilliseconds = 24 * 60 * 60 * 1000;

      // Tính số ngày chênh lệch
      const diffDays = Math.round(
        (endDate.getTime() - startDate.getTime()) / oneDayMilliseconds
      );

      if (diffDays < 0) {
        errors.push("Ngày kết thúc không thể trước ngày bắt đầu");
      } else if (diffDays < 7) {
        errors.push("Ngày kết thúc phải sau ngày bắt đầu ít nhất 7 ngày");
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (selectedCourse && selectedCourse.id) {
        // Cập nhật khóa học
        await courseService.updateCourse(selectedCourse.id, formData);

        // Cập nhật danh sách khóa học
        setCourses((prev) =>
          prev.map((c) =>
            c.id === selectedCourse.id ? { ...c, ...formData } : c
          )
        );
      } else {
        // Thêm khóa học mới
        const newCourseId = await courseService.createCourse(formData);

        // Thêm khóa học mới vào danh sách
        const newCourse: Course = {
          id: newCourseId,
          ...formData,
        };
        setCourses((prev) => [...prev, newCourse]);
      }

      // Đóng modal
      setIsModalOpen(false);
      setValidationErrors([]);
    } catch (err) {
      console.error("Lỗi khi lưu khóa học:", err);
      alert("Đã xảy ra lỗi khi lưu thông tin khóa học. Vui lòng thử lại.");
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      try {
        await courseService.deleteCourse(id);
        setCourses((prev) => prev.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Lỗi khi xóa khóa học:", err);
        alert("Đã xảy ra lỗi khi xóa khóa học. Vui lòng thử lại.");
      }
    }
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

  if (loading) {
    return (
      <DashboardLayout title="Quản lý đào tạo">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Đang tải...</span>
            </div>
            <p className="mt-2">Đang tải dữ liệu...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Quản lý đào tạo">
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 w-full md:w-80 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleNewCourse}
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Tạo khóa học mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tổng quan khóa học
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tổng số khóa học</span>
              <span className="font-semibold text-gray-900">
                {courses.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Đang diễn ra</span>
              <span className="font-semibold text-gray-900">
                {courses.filter((c) => c.status === "Đang diễn ra").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Sắp diễn ra</span>
              <span className="font-semibold text-gray-900">
                {courses.filter((c) => c.status === "Sắp diễn ra").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Đã kết thúc</span>
              <span className="font-semibold text-gray-900">
                {courses.filter((c) => c.status === "Đã kết thúc").length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Thống kê học viên
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tổng số học viên</span>
              <span className="font-semibold text-gray-900">
                {courses.reduce(
                  (sum, course) => sum + (course.maxStudents || 0),
                  0
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Học viên đang học</span>
              <span className="font-semibold text-gray-900">
                {courses
                  .filter((c) => c.status === "Đang diễn ra")
                  .reduce((sum, course) => sum + (course.maxStudents || 0), 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Học viên sắp vào học</span>
              <span className="font-semibold text-gray-900">
                {courses
                  .filter((c) => c.status === "Sắp diễn ra")
                  .reduce((sum, course) => sum + (course.maxStudents || 0), 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Học viên đã hoàn thành</span>
              <span className="font-semibold text-gray-900">
                {courses
                  .filter((c) => c.status === "Đã kết thúc")
                  .reduce((sum, course) => sum + (course.maxStudents || 0), 0)}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.startDate} - {course.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.maxStudents}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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
                        title="Xem chi tiết"
                        onClick={() => handleViewCourse(course)}
                      >
                        <FaEye />
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
                        onClick={() =>
                          course.id && handleDeleteCourse(course.id)
                        }
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
                {isViewMode
                  ? "Chi tiết khóa học"
                  : selectedCourse
                  ? "Chỉnh sửa khóa học"
                  : "Tạo khóa học mới"}
              </h3>
            </div>
            <div className="p-6">
              {validationErrors.length > 0 && !isViewMode && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
                  <div className="text-red-700">
                    <p className="font-medium">
                      Vui lòng kiểm tra lại thông tin:
                    </p>
                    <ul className="mt-1 ml-5 list-disc">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Tên khóa học
                    </label>
                    <input
                      type="text"
                      name="name"
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900 ${
                        isViewMode ? "bg-gray-100" : ""
                      }`}
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      readOnly={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại bằng lái
                    </label>
                    <select
                      name="licenseType"
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
                        isViewMode ? "bg-gray-100" : ""
                      }`}
                      value={formData.licenseType}
                      onChange={handleInputChange}
                      required
                      disabled={isViewMode}
                    >
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
                      name="maxStudents"
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
                        isViewMode ? "bg-gray-100" : ""
                      }`}
                      value={formData.maxStudents}
                      onChange={handleInputChange}
                      required
                      readOnly={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số lượng giáo viên
                    </label>
                    <input
                      type="number"
                      name="instructors"
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
                        isViewMode ? "bg-gray-100" : ""
                      }`}
                      value={formData.instructors}
                      onChange={handleInputChange}
                      required
                      readOnly={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày bắt đầu
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
                        isViewMode ? "bg-gray-100" : ""
                      }`}
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                      readOnly={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày kết thúc
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
                        isViewMode ? "bg-gray-100" : ""
                      }`}
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                      readOnly={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng thái
                    </label>
                    <select
                      name="status"
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
                        isViewMode ? "bg-gray-100" : ""
                      }`}
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      disabled={isViewMode}
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
                      name="fee"
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
                        isViewMode ? "bg-gray-100" : ""
                      }`}
                      value={formData.fee}
                      onChange={handleInputChange}
                      required
                      readOnly={isViewMode}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Mô tả
                    </label>
                    <textarea
                      name="description"
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
                        isViewMode ? "bg-gray-100" : ""
                      }`}
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      readOnly={isViewMode}
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
                {isViewMode ? "Đóng" : "Hủy"}
              </button>
              {!isViewMode && (
                <button
                  type="button"
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                  onClick={handleSubmit}
                >
                  {selectedCourse ? "Cập nhật" : "Tạo mới"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
