"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  FaSearch,
  FaPlus,
  FaPrint,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { licenseService, License } from "@/services/firebaseService";


export default function LicenseManagement() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);
  const [formData, setFormData] = useState<
    Omit<License, "id" | "createdAt" | "updatedAt">
  >({
    studentId: "",
    studentName: "",
    licenseType: "",
    issueDate: "",
    expiryDate: "",
    status: "Đang xử lý",
  });

  // Tải danh sách giấy phép từ Firebase
  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setLoading(true);
        const licensesData = await licenseService.getLicenses();
        setLicenses(licensesData);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu giấy phép:", err);
        setError("Không thể tải dữ liệu giấy phép. Sử dụng dữ liệu mẫu.");
        setLicenses(mockLicenses as License[]);
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, []);

  const filteredLicenses = licenses.filter(
    (license) =>
      license.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (license.id && license.id.includes(searchTerm)) ||
      license.licenseType.includes(searchTerm)
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

  const handleNewLicense = () => {
    setSelectedLicense(null);
    setFormData({
      studentId: "",
      studentName: "",
      licenseType: "",
      issueDate: "",
      expiryDate: "",
      status: "Đang xử lý",
    });
    setIsModalOpen(true);
  };

  const handleEditLicense = (license: License) => {
    setSelectedLicense(license);
    setFormData({
      studentId: license.studentId,
      studentName: license.studentName,
      licenseType: license.licenseType,
      issueDate: license.issueDate,
      expiryDate: license.expiryDate || "",
      status: license.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedLicense && selectedLicense.id) {
        // Cập nhật giấy phép
        await licenseService.updateLicense(selectedLicense.id, formData);

        // Cập nhật danh sách giấy phép
        setLicenses((prev) =>
          prev.map((l) =>
            l.id === selectedLicense.id ? { ...l, ...formData } : l
          )
        );
      } else {
        // Thêm giấy phép mới
        const newLicenseId = await licenseService.createLicense(formData);

        // Thêm giấy phép mới vào danh sách
        const newLicense: License = {
          id: newLicenseId,
          ...formData,
        };
        setLicenses((prev) => [...prev, newLicense]);
      }

      // Đóng modal
      setIsModalOpen(false);
    } catch (err) {
      console.error("Lỗi khi lưu giấy phép:", err);
      alert("Đã xảy ra lỗi khi lưu thông tin giấy phép. Vui lòng thử lại.");
    }
  };

  const handleDeleteLicense = async (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa giấy phép này?")) {
      try {
        await licenseService.deleteLicense(id);
        setLicenses((prev) => prev.filter((l) => l.id !== id));
      } catch (err) {
        console.error("Lỗi khi xóa giấy phép:", err);
        alert("Đã xảy ra lỗi khi xóa giấy phép. Vui lòng thử lại.");
      }
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Quản lý cấp giấy phép lái xe">
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
    <DashboardLayout title="Quản lý cấp giấy phép lái xe">
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
            placeholder="Tìm kiếm theo tên, mã số, loại GPLX..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleNewLicense}
          className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Tạo hồ sơ cấp GPLX mới
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã hồ sơ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ và tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại GPLX
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày cấp
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
              {filteredLicenses.map((license) => (
                <tr key={license.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {license.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {license.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {license.licenseType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {license.issueDate || "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        license.status === "Đã cấp"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {license.status}
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
                        onClick={() => handleEditLicense(license)}
                      >
                        <FaEdit />
                      </button>
                      {license.status === "Đã cấp" && (
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="In GPLX"
                        >
                          <FaPrint />
                        </button>
                      )}
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                        onClick={() =>
                          license.id && handleDeleteLicense(license.id)
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
                {selectedLicense
                  ? "Chỉnh sửa hồ sơ cấp GPLX"
                  : "Tạo hồ sơ cấp GPLX mới"}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số CCCD
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Loại GPLX
                    </label>
                    <select
                      name="licenseType"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.licenseType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Chọn loại GPLX</option>
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Trạng thái
                    </label>
                    <select
                      name="status"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Đã cấp">Đã cấp</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày cấp
                    </label>
                    <input
                      type="date"
                      name="issueDate"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.issueDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày hết hạn
                    </label>
                    <input
                      type="date"
                      name="expiryDate"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Tải lên hình ảnh
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                        >
                          <span>Tải lên ảnh</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">hoặc kéo thả</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF tối đa 10MB
                      </p>
                    </div>
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
                {selectedLicense ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
