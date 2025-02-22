import { toast } from "react-toastify";
import axiosInstance from "../authentication/axiosInstance";
import Cookies from "js-cookie";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
const apiUrl = process.env.REACT_APP_URL_SERVER;

// Login User
export const login = async (account) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/users/login`, {
      account,
    });

    if (response.data.EC === 200) {
      Cookies.set("accessToken", response.data.DT.accessToken, {
        expires: 7,
        path: "",
      });
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    toast.error(error.response.data.EM);
  }
};

// Get List of Users
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/users`);
    if (response.data.EC === 200) {
      return response.data.DT; // Returns the list of users
    }
    return [];
  } catch (error) {
    console.error("Error fetching the list of users:", error);
    return [];
  }
};

// Create New User
export const createUser = async (newUser) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/users`, newUser);
    if (response.data.EC === 201) {
      return true; // User created successfully
    }
    return false;
  } catch (error) {
    console.error("Error creating new user:", error);
    return false;
  }
};

// Update User
export const updateUserById = async (id, updatedUser) => {
  try {
    const response = await axiosInstance.put(
      `${apiUrl}/users/update/${id}`,
      updatedUser
    );
    if (response.data.EC === 200) {
      return true; // User updated successfully
    }
    return false;
  } catch (error) {
    console.error("Error updating user:", error);
    return false;
  }
};

// Delete User
export const deleteUserById = async (userId) => {
  try {
    const response = await axiosInstance.delete(
      `${apiUrl}/users/delete/${userId}`
    );
    if (response.data.EC === 200) {
      return true; // User deleted successfully
    }
    return false;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};

export const verifyAdmin = async (accessToken) => {
  if (!accessToken) {
    return false;
  }

  try {
    const response = await axios.post(
      `${process.env.REACT_APP_URL_SERVER}/verify-admin`,
      {
        token: accessToken,
      }
    );

    // Kết quả phản hồi từ backend
    console.log("response.data admin ", response.data);
    if (response.data.DT.isAdmin) {
      // console.log("User is admin");
      return true;
    } else {
      // console.log("User is not admin");
      return false;
    }
  } catch (error) {
    enqueueSnackbar("Bạn không có quyền truy cập vào trang này", {
      variant: "info",
    });
    console.error("Error verifying admin:", error);
    return false;
  }
};
