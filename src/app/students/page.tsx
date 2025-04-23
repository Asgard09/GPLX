"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaIdCard,
} from "react-icons/fa";
import { studentService, Student } from "@/services/firebaseService";

// Thêm dữ liệu mẫu
const mockStudents = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    dob: "01/01/1990",
    phone: "0901234567",
    address: "Hà Nội",
    course: "B1",
    status: "Đang học",
  },
  {
    id: "2",
    name: "Trần Thị B",
    dob: "02/03/1992",
    phone: "0912345678",
    address: "TP.HCM",
    course: "A1",
    status: "Đang học",
  },
  {
    id: "3",
    name: "Lê Văn C",
    dob: "10/05/1985",
    phone: "0923456789",
    address: "Đà Nẵng",
    course: "B2",
    status: "Đã tốt nghiệp",
  },
  {
    id: "4",
    name: "Phạm Thị D",
    dob: "15/08/1995",
    phone: "0934567890",
    address: "Cần Thơ",
    course: "A2",
    status: "Đang học",
  },
  {
    id: "5",
    name: "Hoàng Văn E",
    dob: "20/12/1988",
    phone: "0945678901",
    address: "Hải Phòng",
    course: "C",
    status: "Chưa học",
  },
];

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<
    Omit<Student, "id" | "createdAt" | "updatedAt">
  >({
    name: "",
    dob: "",
    phone: "",
    address: "",
    cccd: "",
    course: "",
    status: "Chưa học",
  });

  // Tải danh sách học viên từ Firebase
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const studentsData = await studentService.getStudents();
        setStudents(studentsData);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu học viên:", err);
        setError("Không thể tải dữ liệu học viên. Sử dụng dữ liệu mẫu.");
        setStudents(mockStudents);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.id && student.id.includes(searchTerm)) ||
      student.phone.includes(searchTerm)
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewStudent = () => {
    setSelectedStudent(null);
    setFormData({
      name: "",
      dob: "",
      phone: "",
      address: "",
      cccd: "",
      course: "",
      status: "Chưa học",
    });
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      dob: student.dob,
      phone: student.phone,
      address: student.address,
      cccd: student.cccd || "",
      course: student.course,
      status: student.status,
    });
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      dob: student.dob,
      phone: student.phone,
      address: student.address,
      cccd: student.cccd || "",
      course: student.course,
      status: student.status,
    });
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push("Họ và tên không được để trống");
    if (!formData.dob) errors.push("Ngày sinh không được để trống");
    if (!formData.cccd.trim()) errors.push("Số CCCD/CMND không được để trống");
    if (!formData.phone.trim())
      errors.push("Số điện thoại không được để trống");
    if (!formData.address.trim()) errors.push("Địa chỉ không được để trống");
    if (!formData.course) errors.push("Khóa học không được để trống");

    // Kiểm tra số CCCD/CMND
    if (formData.cccd && formData.cccd.length < 9) {
      errors.push("Số CCCD/CMND không hợp lệ");
    }

    // Kiểm tra số điện thoại
    if (formData.phone && !/^0\d{9}$/.test(formData.phone)) {
      errors.push("Số điện thoại phải có 10 số và bắt đầu bằng số 0");
    }

    // Kiểm tra ngày sinh (phải đủ 18 tuổi)
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        errors.push("Học viên phải đủ 18 tuổi trở lên");
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
      if (selectedStudent && selectedStudent.id) {
        // Cập nhật học viên
        await studentService.updateStudent(selectedStudent.id, formData);

        // Cập nhật danh sách học viên
        setStudents((prev) =>
          prev.map((s) =>
            s.id === selectedStudent.id ? { ...s, ...formData } : s
          )
        );
      } else {
        // Thêm học viên mới
        const newStudentId = await studentService.createStudent(formData);

        // Thêm học viên mới vào danh sách
        const newStudent: Student = {
          id: newStudentId,
          ...formData,
        };
        setStudents((prev) => [...prev, newStudent]);
      }

      // Đóng modal
      setIsModalOpen(false);
      setValidationErrors([]);
    } catch (err) {
      console.error("Lỗi khi lưu học viên:", err);
      alert("Đã xảy ra lỗi khi lưu thông tin học viên. Vui lòng thử lại.");
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa học viên này?")) {
      try {
        await studentService.deleteStudent(id);
        setStudents((prev) => prev.filter((s) => s.id !== id));
      } catch (err) {
        console.error("Lỗi khi xóa học viên:", err);
        alert("Đã xảy ra lỗi khi xóa học viên. Vui lòng thử lại.");
      }
    }
  };

  function getStatusColor(status: string) {
    switch (status) {
      case "Đang học":
        return "bg-blue-100 text-blue-800";
      case "Đã tốt nghiệp":
        return "bg-green-100 text-green-800";
      case "Chưa học":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Quản lý học viên">
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
    <DashboardLayout title="Quản lý học viên">
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
            placeholder="Tìm kiếm theo tên, mã học viên, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleNewStudent}
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Thêm học viên mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã học viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ và tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày sinh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khóa học
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
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.dob}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        student.status
                      )}`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem chi tiết"
                        onClick={() => handleViewStudent(student)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="Đăng ký GPLX"
                      >
                        <FaIdCard />
                      </button>
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Chỉnh sửa"
                        onClick={() => handleEditStudent(student)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                        onClick={() =>
                          student.id && handleDeleteStudent(student.id)
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
                  ? "Chi tiết học viên"
                  : selectedStudent
                  ? "Chỉnh sửa thông tin học viên"
                  : "Thêm học viên mới"}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="name"
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
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
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      name="dob"
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
                        isViewMode ? "bg-gray-100" : ""
                      }`}
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                      readOnly={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số CCCD/CMND
                    </label>
                    <input
                      type="text"
                      name="cccd"
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
                        isViewMode ? "bg-gray-100" : ""
                      }`}
                      value={formData.cccd}
                      onChange={handleInputChange}
                      required
                      readOnly={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
                        isViewMode ? "bg-gray-100" : ""
                      }`}
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      readOnly={isViewMode}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      name="address"
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
                        isViewMode ? "bg-gray-100" : ""
                      }`}
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      readOnly={isViewMode}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Khóa học đăng ký
                    </label>
                    <select
                      name="course"
                      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 ${
                        isViewMode ? "bg-gray-100" : ""
                      }`}
                      value={formData.course}
                      onChange={handleInputChange}
                      required
                      disabled={isViewMode}
                    >
                      <option value="">Chọn khóa học</option>
                      <option value="A1">Khóa đào tạo lái xe hạng A1</option>
                      <option value="A2">Khóa đào tạo lái xe hạng A2</option>
                      <option value="B1">Khóa đào tạo lái xe hạng B1</option>
                      <option value="B2">Khóa đào tạo lái xe hạng B2</option>
                      <option value="C">Khóa đào tạo lái xe hạng C</option>
                    </select>
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
                      <option value="Chưa học">Chưa học</option>
                      <option value="Đang học">Đang học</option>
                      <option value="Đã tốt nghiệp">Đã tốt nghiệp</option>
                    </select>
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
                  {selectedStudent ? "Cập nhật" : "Tạo mới"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
