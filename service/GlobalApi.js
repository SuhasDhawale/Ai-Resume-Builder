import axios from "axios";

const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;  // Make sure the API key is correctly set in the environment
const axiosClient = axios.create({
    baseURL: 'http://localhost:1337/api',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
    }
});

// Function to create a new resume
const CreateNewResume = async (data) => {
    try {
        const response = await axiosClient.post('/user-resumes', data);
        return response;  // Return the response to handle in your component
    } catch (error) {
        console.error("Error in API call:", error.response ? error.response.data : error.message);
        throw error;  // Rethrow the error so it can be caught in your component
    }
};

const GetUserResumes=(userEmail)=>axiosClient.get('/user-resumes');

export default {
    CreateNewResume,
    GetUserResumes
};
