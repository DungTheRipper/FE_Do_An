import React, {useState} from "react";
import {IoMdClose} from "react-icons/io";
import {IoCheckmarkCircleOutline} from "react-icons/io5";

const NotificationPopup = ({ code, onClose }) => {
    console.log("NotificationPopup rendered with code:", code);

    const codeMessageMap = {
        // Success
        "SUCCESS": "Operation was successful!",
            //Register
        "REGISTER_SUCCESS": "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận.",
        // Error
        "ERROR": "Đã có lỗi xảy ra. Vui lòng thử lại!",
            // Register
        "EMAIL_EXIST_ERROR": "Email này đã được sử dụng!",
            // Login
        "LOGIN_EMPTY_FIELDS": "Yêu cầu nhập đầy đủ email và mật khẩu!",
        "LOGIN_USER_NOT_FOUND": "Tài khoản không tồn tại!",
        "LOGIN_WRONG_PASSWORD": "Mật khẩu không đúng!",
        "LOGIN_INACTIVE_ACCOUNT": "Tài khoản này đã bị vô hiệu hóa!",
        "LOGIN_UNVERIFIED_EMAIL": "Tài khoản chưa xác minh email."
    };

    const codeTitleMap = {
        // Success
        "SUCCESS": "Thành công",
            // Register
        "REGISTER_SUCCESS": "Thành công",
        // Error
        "ERROR": "Lỗi",
            // Register
        "EMAIL_EXIST_ERROR": "Lỗi",
            // Login
        "LOGIN_EMPTY_FIELDS": "Lỗi",
        "LOGIN_USER_NOT_FOUND": "Lỗi",
        "LOGIN_WRONG_PASSWORD": "Lỗi",
        "LOGIN_INACTIVE_ACCOUNT": "Lỗi",
        "LOGIN_UNVERIFIED_EMAIL": "Lỗi"
    };

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