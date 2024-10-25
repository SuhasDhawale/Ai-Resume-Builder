import { useEffect, useState } from 'react';
import { useUser } from "@clerk/clerk-react";
import AddResume from "./components/AddResume";
import GlobalApi from "../../service/GlobalApi";
import ResumeCardItem from './components/ResumeCardItem';
const DashBoard = () => {
    const { user } = useUser();
    const [resumeList, setResumeList] = useState([]);  // Ensure initialized as empty array
    useEffect(() => {
        if (user) {
            getResumeList();
        }
    }, [user]);
    const getResumeList = async () => {
        try {
            const response = await GlobalApi.GetUserResumes(user?.primaryEmailAddress?.emailAddress);
            console.log(response.data);
            setResumeList(response.data?.data || []);  // Safely handle the data structure
        } catch (error) {
            console.error('Failed to fetch resume list', error);
        }
    };
    return (
        <div className="p-10 md:p-20 lg:p-10">
            <h2 className="font-extrabold text-3xl uppercase">
                My Resume
            </h2>
            <p className="uppercase">Start creating AI resume for your next job role</p>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 h-[230px]">
                <AddResume />

                {resumeList && resumeList.length > 0 ? (
                    resumeList.map((resume, idx) => (
                        <ResumeCardItem key={idx} resume={resume} refreshData={getResumeList} />
                    ))
                ) : (
                    <p>No resumes available. Add a new one!</p>  // Optional fallback message
                )}
            </div>
        </div>
    );
};

export default DashBoard;
