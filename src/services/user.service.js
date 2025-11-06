import axios from "axios";
import dotenv from "dotenv"
import authHeader from "./auth-header";

// const API_URL = "https://swif.ttlawcourts.org:8080/api/test/";
const API_URL = import.meta.env.VITE_API_URL

const getPublicContent = () => {
  return axios.get(API_URL + "all");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const userService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

export default userService