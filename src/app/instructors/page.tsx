"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaChalkboardTeacher,
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

// Định nghĩa interface cho giáo viên
interface Instructor {
  id?: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  address: string;
  specialization: string;
  status: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Dịch vụ Firebase cho giáo viên
const instructorService = {
  getInstructors: async (): Promise<Instructor[]> => {
    const instructorsCollection = collection(db, "instructors");
    const instructorsSnapshot = await getDocs(instructorsCollection);
    return instructorsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Instructor[];
  },

  getInstructorById: async (id: string): Promise<Instructor | null> => {
    const instructorDoc = doc(db, "instructors", id);
    const instructorSnapshot = await getDoc(instructorDoc);

    if (instructorSnapshot.exists()) {
      return {
        id: instructorSnapshot.id,
        ...instructorSnapshot.data(),
      } as Instructor;
    }

    return null;
  },

  createInstructor: async (
    instructor: Omit<Instructor, "id" | "createdAt" | "updatedAt">
  ): Promise<string> => {
    const instructorsCollection = collection(db, "instructors");
    const docRef = await addDoc(instructorsCollection, {
      ...instructor,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  },

  updateInstructor: async (
    id: string,
    instructor: Partial<Omit<Instructor, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> => {
    const instructorDoc = doc(db, "instructors", id);
    await updateDoc(instructorDoc, {
      ...instructor,
      updatedAt: serverTimestamp(),
    });
  },

  deleteInstructor: async (id: string): Promise<void> => {
    const instructorDoc = doc(db, "instructors", id);
    await deleteDoc(instructorDoc);
  },
};

// Dữ liệu mẫu
const mockInstructors = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    dob: "1980-05-10",
    phone: "0901234567",
    email: "an.nguyen@gmail.com",
    address: "Hà Nội",
    specialization: "Lý thuyết",
    status: "Đang dạy",
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    dob: "1985-08-15",
    phone: "0912345678",
    email: "binh.tran@gmail.com",
    address: "TP.HCM",
    specialization: "Thực hành",
    status: "Đang dạy",
  },
  {
    id: "3",
    name: "Phạm Văn Cường",
    dob: "1978-03-20",
    phone: "0923456789",
    email: "cuong.pham@gmail.com",
    address: "Đà Nẵng",
    specialization: "Lý thuyết & Thực hành",
    status: "Đang dạy",
  },
  {
    id: "4",
    name: "Lê Thị Dung",
    dob: "1982-11-05",
    phone: "0934567890",
    email: "dung.le@gmail.com",
    address: "Hải Phòng",
    specialization: "Thực hành",
    status: "Nghỉ phép",
  },
  {
    id: "5",
    name: "Hoàng Văn Em",
    dob: "1975-07-25",
    phone: "0945678901",
    email: "em.hoang@gmail.com",
    address: "Cần Thơ",
    specialization: "Lý thuyết",
    status: "Đã nghỉ việc",
  },
];

export default function InstructorManagement() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [formData, setFormData] = useState<
    Omit<Instructor, "id" | "createdAt" | "updatedAt">
  >({
    name: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    specialization: "",
    status: "Đang dạy",
  });

  // Tải danh sách giáo viên từ Firebase
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const instructorsData = await instructorService.getInstructors();
        setInstructors(instructorsData);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu giáo viên:", err);
        setError("Không thể tải dữ liệu giáo viên. Sử dụng dữ liệu mẫu.");
        setInstructors(mockInstructors as Instructor[]);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (instructor.id && instructor.id.includes(searchTerm)) ||
      instructor.phone.includes(searchTerm) ||
      instructor.email.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleNewInstructor = () => {
    setSelectedInstructor(null);
    setFormData({
      name: "",
      dob: "",
      phone: "",
      email: "",
      address: "",
      specialization: "",
      status: "Đang dạy",
    });
    setIsModalOpen(true);
  };

  const handleEditInstructor = (instructor: Instructor) => {
    setSelectedInstructor(instructor);
    setFormData({
      name: instructor.name,
      dob: instructor.dob,
      phone: instructor.phone,
      email: instructor.email,
      address: instructor.address,
      specialization: instructor.specialization,
      status: instructor.status,
    });
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push("Họ và tên không được để trống");
    if (!formData.dob) errors.push("Ngày sinh không được để trống");
    if (!formData.phone.trim())
      errors.push("Số điện thoại không được để trống");
    if (!formData.email.trim()) errors.push("Email không được để trống");
    if (!formData.address.trim()) errors.push("Địa chỉ không được để trống");
    if (!formData.specialization) errors.push("Chuyên môn không được để trống");

    // Kiểm tra số điện thoại
    if (formData.phone && !/^0\d{9}$/.test(formData.phone)) {
      errors.push("Số điện thoại phải có 10 số và bắt đầu bằng số 0");
    }

    // Kiểm tra email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Email không đúng định dạng");
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

      if (age < 22) {
        errors.push("Giáo viên phải từ 22 tuổi trở lên");
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
      if (selectedInstructor && selectedInstructor.id) {
        // Cập nhật giáo viên
        await instructorService.updateInstructor(
          selectedInstructor.id,
          formData
        );

        // Cập nhật danh sách giáo viên
        setInstructors((prev) =>
          prev.map((i) =>
            i.id === selectedInstructor.id ? { ...i, ...formData } : i
          )
        );
      } else {
        // Thêm giáo viên mới
        const newInstructorId = await instructorService.createInstructor(
          formData
        );

        // Thêm giáo viên mới vào danh sách
        const newInstructor: Instructor = {
          id: newInstructorId,
          ...formData,
        };
        setInstructors((prev) => [...prev, newInstructor]);
      }

      // Đóng modal
      setIsModalOpen(false);
      setValidationErrors([]);
    } catch (err) {
      console.error("Lỗi khi lưu giáo viên:", err);
      alert("Đã xảy ra lỗi khi lưu thông tin giáo viên. Vui lòng thử lại.");
    }
  };

  const handleDeleteInstructor = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giáo viên này?")) {
      try {
        await instructorService.deleteInstructor(id);
        setInstructors((prev) => prev.filter((i) => i.id !== id));
      } catch (err) {
        console.error("Lỗi khi xóa giáo viên:", err);
        alert("Đã xảy ra lỗi khi xóa giáo viên. Vui lòng thử lại.");
      }
    }
  };

  function getStatusColor(status: string) {
    switch (status) {
      case "Đang dạy":
        return "bg-green-100 text-green-800";
      case "Nghỉ phép":
        return "bg-yellow-100 text-yellow-800";
      case "Đã nghỉ việc":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Quản lý giáo viên">
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
    <DashboardLayout title="Quản lý giáo viên">
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
            placeholder="Tìm kiếm theo tên, mã giáo viên, số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleNewInstructor}
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Thêm giáo viên mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã giáo viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ và tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chuyên môn
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
              {filteredInstructors.map((instructor) => (
                <tr key={instructor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {instructor.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {instructor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {instructor.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {instructor.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {instructor.specialization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        instructor.status
                      )}`}
                    >
                      {instructor.status}
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
                        onClick={() => handleEditInstructor(instructor)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                        onClick={() =>
                          instructor.id && handleDeleteInstructor(instructor.id)
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
                {selectedInstructor
                  ? "Chỉnh sửa thông tin giáo viên"
                  : "Thêm giáo viên mới"}
              </h3>
            </div>
            <div className="p-6">
              {validationErrors.length > 0 && (
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
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày sinh
                    </label>
                    <input
                      type="date"
                      name="dob"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      value={formData.dob}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      name="address"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Chuyên môn
                    </label>
                    <select
                      name="specialization"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-900"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn chuyên môn</option>
                      <option value="Lý thuyết">Lý thuyết</option>
                      <option value="Thực hành">Thực hành</option>
                      <option value="Lý thuyết & Thực hành">
                        Lý thuyết & Thực hành
                      </option>
                    </select>
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
                      <option value="Đang dạy">Đang dạy</option>
                      <option value="Nghỉ phép">Nghỉ phép</option>
                      <option value="Đã nghỉ việc">Đã nghỉ việc</option>
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
                Hủy
              </button>
              <button
                type="button"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                onClick={handleSubmit}
              >
                {selectedInstructor ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
