"use client";

import { useState, useEffect } from "react";
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
import { db } from "@/firebase/config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// Định nghĩa interface cho kỳ thi
interface Exam {
  id?: string;
  title: string;
  examDate: string;
  location: string;
  licenseType: string;
  maxParticipants: number;
  registeredParticipants: number;
  status: string;
  description?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Dịch vụ Firebase cho kỳ thi
const examService = {
  getExams: async (): Promise<Exam[]> => {
    const examsCollection = collection(db, "exams");
    const examsSnapshot = await getDocs(examsCollection);
    return examsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Exam[];
  },

  getExamById: async (id: string): Promise<Exam | null> => {
    const examDoc = doc(db, "exams", id);
    const examSnapshot = await getDoc(examDoc);

    if (examSnapshot.exists()) {
      return {
        id: examSnapshot.id,
        ...examSnapshot.data(),
      } as Exam;
    }

    return null;
  },

  createExam: async (
    exam: Omit<Exam, "id" | "createdAt" | "updatedAt">
  ): Promise<string> => {
    const examsCollection = collection(db, "exams");
    const docRef = await addDoc(examsCollection, {
      ...exam,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  },

  updateExam: async (
    id: string,
    exam: Partial<Omit<Exam, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> => {
    const examDoc = doc(db, "exams", id);
    await updateDoc(examDoc, {
      ...exam,
      updatedAt: serverTimestamp(),
    });
  },

  deleteExam: async (id: string): Promise<void> => {
    const examDoc = doc(db, "exams", id);
    await deleteDoc(examDoc);
  },
};

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
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [formData, setFormData] = useState<
    Omit<Exam, "id" | "createdAt" | "updatedAt">
  >({
    title: "",
    examDate: "",
    location: "",
    licenseType: "",
    maxParticipants: 0,
    registeredParticipants: 0,
    status: "Sắp diễn ra",
    description: "",
  });

  // Tải danh sách kỳ thi từ Firebase
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const examsData = await examService.getExams();
        setExams(examsData);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu kỳ thi:", err);
        setError("Không thể tải dữ liệu kỳ thi. Sử dụng dữ liệu mẫu.");
        setExams(mockExams as Exam[]);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const filteredExams = exams.filter(
    (exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exam.id && exam.id.includes(searchTerm)) ||
      exam.licenseType.includes(searchTerm) ||
      exam.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Xử lý đặc biệt cho các trường số
    if (name === "maxParticipants" || name === "registeredParticipants") {
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

  const handleNewExam = () => {
    setSelectedExam(null);
    setFormData({
      title: "",
      examDate: "",
      location: "",
      licenseType: "",
      maxParticipants: 0,
      registeredParticipants: 0,
      status: "Sắp diễn ra",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleEditExam = (exam: Exam) => {
    setSelectedExam(exam);
    setFormData({
      title: exam.title,
      examDate: exam.examDate,
      location: exam.location,
      licenseType: exam.licenseType,
      maxParticipants: exam.maxParticipants,
      registeredParticipants: exam.registeredParticipants,
      status: exam.status,
      description: exam.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedExam && selectedExam.id) {
        // Cập nhật kỳ thi
        await examService.updateExam(selectedExam.id, formData);

        // Cập nhật danh sách kỳ thi
        setExams((prev) =>
          prev.map((e) =>
            e.id === selectedExam.id ? { ...e, ...formData } : e
          )
        );
      } else {
        // Thêm kỳ thi mới
        const newExamId = await examService.createExam(formData);

        // Thêm kỳ thi mới vào danh sách
        const newExam: Exam = {
          id: newExamId,
          ...formData,
        };
        setExams((prev) => [...prev, newExam]);
      }

      // Đóng modal
      setIsModalOpen(false);
    } catch (err) {
      console.error("Lỗi khi lưu kỳ thi:", err);
      alert("Đã xảy ra lỗi khi lưu thông tin kỳ thi. Vui lòng thử lại.");
    }
  };

  const handleDeleteExam = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa kỳ thi này?")) {
      try {
        await examService.deleteExam(id);
        setExams((prev) => prev.filter((e) => e.id !== id));
      } catch (err) {
        console.error("Lỗi khi xóa kỳ thi:", err);
        alert("Đã xảy ra lỗi khi xóa kỳ thi. Vui lòng thử lại.");
      }
    }
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

  if (loading) {
    return (
      <DashboardLayout title="Quản lý kỳ thi sát hạch">
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
    <DashboardLayout title="Quản lý kỳ thi sát hạch">
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
              {exams.reduce(
                (sum, exam) => sum + exam.registeredParticipants,
                0
              )}
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
              {exams.reduce(
                (sum, exam) => sum + exam.registeredParticipants,
                0
              )}
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
                  Địa điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại bằng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thí sinh đăng ký
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
                    {exam.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.examDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.licenseType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {exam.registeredParticipants}/{exam.maxParticipants}
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
                        onClick={() => exam.id && handleDeleteExam(exam.id)}
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
                      Tên kỳ thi
                    </label>
                    <input
                      type="text"
                      name="title"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày thi
                    </label>
                    <input
                      type="date"
                      name="examDate"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      value={formData.examDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại bằng
                    </label>
                    <select
                      name="licenseType"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      value={formData.licenseType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn loại bằng</option>
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Địa điểm
                    </label>
                    <input
                      type="text"
                      name="location"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số lượng tối đa
                    </label>
                    <input
                      type="number"
                      name="maxParticipants"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số lượng đăng ký
                    </label>
                    <input
                      type="number"
                      name="registeredParticipants"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      value={formData.registeredParticipants}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng thái
                    </label>
                    <select
                      name="status"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Sắp diễn ra">Sắp diễn ra</option>
                      <option value="Đang diễn ra">Đang diễn ra</option>
                      <option value="Đã kết thúc">Đã kết thúc</option>
                      <option value="Đã hủy">Đã hủy</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Mô tả
                    </label>
                    <textarea
                      name="description"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
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
                className="py-2 px-4 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                onClick={handleSubmit}
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
