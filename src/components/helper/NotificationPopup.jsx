import React, {useState} from "react";
import {IoMdClose} from "react-icons/io";
import {IoCheckmarkCircleOutline} from "react-icons/io5";

const NotificationPopup = ({ code, onClose }) => {
    console.log("NotificationPopup rendered with code:", code);

    const codeMessageMap = {
        "SUCCESS": "Operation was successful!",
        "REGISTER_SUCCESS": "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.",
        "ERROR": "Đã có lỗi xảy ra. Vui lòng thử lại!",
        "EMAIL_EXIST_ERROR": "Email này đã được sử dụng!",
        "NOT_VERIFIED_EMAIL_LOGIN": "Email này chưa được xác thực. Vui lòng xác thực và thử lại!",
        "LOGIN_WRONG_EMAIL_PASSWORD": "Email hoặc mật khẩu không đúng."
    };

    const codeTitleMap = {
        "SUCCESS": "Success",
        "REGISTER_SUCCESS": "Success",
        "ERROR": "Error",
        "EMAIL_EXIST_ERROR": "Error"
    }

    const message = codeMessageMap[code] || "No message available for this code.";
    const title = codeTitleMap[code] || "No title available for this code.";

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
                role="alert"
                className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 transform transition-all"
                aria-live="polite"
            >
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    <p className="text-gray-600 mt-1">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className="absolute text-gray-500 hover:text-gray-700 transition-colors right-3 top-3"
                    aria-label="Close notifications"
                >
                    <IoMdClose size={24}/>
                </button>
            </div>
        </div>
    );
};

export default NotificationPopup;