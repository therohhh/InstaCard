const API_BASE_URL = import.meta.env.PROD
  ? "https://instacard-api-pn18.onrender.com"
  : "http://localhost:5000";

export default API_BASE_URL;