import { defaultAxiosInstance, axiosWithoutLoading } from "../utils/axios.customize";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Hàm chuyển đổi đối tượng thành FormData
const convertToFormData = (data: { [key: string]: any }): FormData => {
  const formData = new FormData();
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      // Skip undefined or null values
      if (data[key] === undefined || data[key] === null) {
        continue;
      }
      // Check if the value is a File or Blob
      if (data[key] instanceof File || data[key] instanceof Blob) {
        formData.append(key, data[key]);
      } else {
        formData.append(key, data[key].toString());
      }
    }
  }
  return formData;
};


const LoginUserApi = async (data: { UserName: string; Password: string }) => {
 
    const formData = convertToFormData(data);
    const response = await defaultAxiosInstance.post("/api/authentication/login", formData);
    return response.data;
 
};

const GetCurrentLogin = async () => {
  const URL_API = "/api/authentication/current-user";
  const token = await AsyncStorage.getItem("token");
  if (token) {
    const response = await axiosWithoutLoading.get(URL_API);
    return response.data;
  }
};

const GetAllUsers = async (params: {
  Role?: string | null;
  Active: boolean;
  IsVerified: boolean;
  PageNumber: number;
  PageSize: number;
  SearchName?: string | null;
}) => {
  const URL_API = "/api/users";

  const queryParams = new URLSearchParams({
    Active: params.Active.toString(),
    IsVerified: params.IsVerified.toString(),
    PageNumber: params.PageNumber.toString(),
    PageSize: params.PageSize.toString(),
  });
  if (params.Role) {
    queryParams.append("Role", params.Role);
  }
  if (params.SearchName) {
    queryParams.append("SearchName", params.SearchName);
  }
  const fullUrl = `${URL_API}?${queryParams.toString()}`;
  const response = await defaultAxiosInstance.post(fullUrl);
  console.log(response);
  return response.data;
};
const DeleteUser = async (userId: string) => {
  const URL_API = `/api/users/${userId}/deactivate`;
  const response = await defaultAxiosInstance.put(URL_API);
  return response.data;
};
const ViewUser = async (userId: string) => {
  const URL_API = `/api/users/${userId}`;
  const response = await axiosWithoutLoading.get(URL_API);
  return response.data;
};

const UpdateUser = async (
  userId: string,
  data: {
    Fullname: string;
    Gender: string;
    Birthday: string;
    UserName: string;
    Address?: string | null;
    PhoneNumber: string;
    CccdFront?: File | null; // File object cho ảnh
    CccdBack?: File | null; // File object cho ảnh
    Avatar?: File | null; // File object cho ảnh
  }
) => {
  const formData = new FormData();

  formData.append("Fullname", data.Fullname);
  formData.append("Gender", data.Gender);
  formData.append("Birthday", data.Birthday);
  formData.append("UserName", data.UserName);
  formData.append("PhoneNumber", data.PhoneNumber);

  if (data.Address) {
    formData.append("Address", data.Address);
  }
  if (data.CccdFront) {
    formData.append("CccdFront", data.CccdFront);
  }
  if (data.CccdBack) {
    formData.append("CccdBack", data.CccdBack);
  }
  if (data.Avatar) {
    formData.append("Avatar", data.Avatar);
  }

  const response = await defaultAxiosInstance.put(
    `/api/users/${userId}`,
    formData
  );

  return response.data;
};

const AddAccountCustomerApi = async (data: {
  Fullname: string;
  Gender: string;
  Birthday: string;
  UserName: string;
  Password: string;
  PhoneNumber: string;
}) => {
  const URL_API = "/api/authentication/customers";
  const formData = convertToFormData(data);
  try {
    const response = await axiosWithoutLoading.post(URL_API, formData);
    return response.data;
  } catch (error) {
    console.error("Error adding account:", error);
    throw error;
  }
};
const AddAccountMechanistsApi = async (data: {
  Fullname: string;
  Gender: string;
  Birthday: string;
  UserName: string;
  Password: string;
  PhoneNumber: string;
}) => {
  const URL_API = "/api/authentication/mechanists";
  const formData = convertToFormData(data);
  try {
    const response = await axiosWithoutLoading.post(URL_API, formData);
    return response.data;
  } catch (error) {
    console.error("Error adding account:", error);
    throw error;
  }
};
const GetAllRepairServices = async (params: {
  Active?: boolean;
  PageNumber: number;
  PageSize: number;
  SearchName?: string | null;
}) => {
  const URL_API = "/api/repair-services/get-services";

  const queryParams = new URLSearchParams({
    PageNumber: params.PageNumber.toString(),
    PageSize: params.PageSize.toString(),
  });

  if (params.Active !== undefined) {
    queryParams.append("Active", params.Active.toString());
  }

  if (params.SearchName) {
    queryParams.append("SearchName", params.SearchName);
  }

  const fullUrl = `${URL_API}?${queryParams.toString()}`;

  const response = await defaultAxiosInstance.post(fullUrl);

  return response.data;

};
const AddRepairServiceApi = async (data: {
  File: File;
  Name: string;
  Description: string;
  Price: number;
}) => {
  const URL_API = "/api/repair-services";
  const formData = convertToFormData(data);

  const response = await axiosWithoutLoading.post(URL_API, formData);

  return response.data;
};
const DeleteRepairServiceApi = async (serviceId: string) => {
  const URL_API = `/api/repair-services/${serviceId}`;
  const response = await defaultAxiosInstance.delete(URL_API);
  return response.data;
};
const GetRepairServiceById = async (serviceId: string) => {
  const URL_API = `/api/repair-services/${serviceId}`;
  const response = await axiosWithoutLoading.get(URL_API);
  return response.data;
};
const EditRepairServiceApi = async (
  serviceId: string,
  data: {
    File?: File;
    Name: string;
    Description: string;
    Price: number;
  }
) => {
  const URL_API = `/api/repair-services/${serviceId}`;
  const formData = convertToFormData(data);

  const response = await axiosWithoutLoading.put(URL_API, formData);

  return response.data;
};
const GetAllCategories = async () => {
  const URL_API = "/api/categories";
  const response = await axiosWithoutLoading.get(URL_API);
  return response.data;
};
const BookingsnApi = async (data: {  
  ServiceId: string; 
  CustomerId: string; 
  Address: string; 
  WorkingDate: string; 
  WorkingTime: string 
}) => {
  const URL_API = "/api/bookings";
  const formData = new FormData();

  // Kiểm tra và sửa định dạng ngày và giờ nếu cần
  const formattedDate = data.WorkingDate.replace(/\//g, "-"); // Chuyển đổi 'YYYY/MM/DD' thành 'YYYY-MM-DD'
  const formattedTime = data.WorkingTime.padStart(5, "0"); // Đảm bảo định dạng giờ là 'HH:MM'

  // Thêm dữ liệu vào formData
  formData.append("ServiceId", data.ServiceId);
  formData.append("CustomerId", data.CustomerId);
  formData.append("Address", data.Address);
  formData.append("WorkingDate", formattedDate);
  formData.append("WorkingTime", formattedTime);

 
    const response = await defaultAxiosInstance.post(URL_API, formData);
    console.log(">>>>>>>>>> ",response);
    return response;
 
};
const AddTransactionApi = async (data: {
  Amount: number;
  BookingId: string;
  UserId: string;
}) => {
  const URL_API = "/api/transactions";
  const formData = convertToFormData(data);

  try {
    const response = await axiosWithoutLoading.post(URL_API, formData);
    return response.data;
  } catch (error) {
    console.error("Error adding transaction:", error);
    throw error;
  }
};
const RegisterUserApi = async (data: {
  Fullname?: string;
  Gender?: string;
  Birthday?: string;
  Address?: string;
  UserName: string;
  Password: string;
  PhoneNumber: string;
}) => {
  const URL_API = "/api/authentication/customers";
  const formData = new FormData();

  formData.append("Fullname", data.Fullname || "");
  formData.append("Gender", data.Gender || "Male");
  formData.append("Birthday", data.Birthday || "2025-02-03");
  formData.append("Address", data.Address || "");
  formData.append("UserName", data.UserName);
  formData.append("Password", data.Password);
  formData.append("PhoneNumber", data.PhoneNumber);

  try {
    const response = await axiosWithoutLoading.post(URL_API, formData);
    return response.data;
  } catch (error) {
    console.error("Error adding account:", error);
    throw error;
  }
};
export {
  RegisterUserApi,
  AddTransactionApi,
  BookingsnApi,
  GetAllCategories,
  EditRepairServiceApi,
  GetRepairServiceById,
  DeleteRepairServiceApi,
  AddRepairServiceApi,
  GetAllRepairServices,
  AddAccountCustomerApi,
  AddAccountMechanistsApi,
  UpdateUser,
  ViewUser,
  DeleteUser,
  GetAllUsers,
  GetCurrentLogin,
  LoginUserApi,
};
