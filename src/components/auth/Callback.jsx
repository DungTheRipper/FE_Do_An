import React from "react";

const Callback = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                <h1 className="text-2xl font-semibold text-green-600">Đăng nhập thành công</h1>
                <p className="mt-4 text-gray-700">
                    Bạn đã đăng nhập thành công qua OAuth2! 🎉
                </p>
                <p className="mt-2 text-sm text-gray-500">
                    Bạn có thể tiếp tục sử dụng ứng dụng ngay bây giờ.
                </p>
            </div>
        </div>
    );
};

export default Callback;
