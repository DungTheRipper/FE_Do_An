import React from "react";
import { CgSpinner } from "react-icons/cg";

const Loading = () => {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-50 z-50">
            <div className="flex flex-col items-center space-y-4">
                <CgSpinner className="animate-spin h-10 w-10 text-indigo-600" />
                <p className="text-gray-600 font-medium">Loading...</p>
            </div>
        </div>
    );
};

export default Loading;
