import React, {useState} from "react";
import LoginForm from "./LoginForm.jsx";
import RegistrationForm from "./RegistrationForm.jsx";

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pb-12 px-4 sm:px-6 lg:px-8">
            <img src="/logo.png" alt="logo" className="w-40 h-40"/>
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isLogin ? "Sign in to your account" : "Create your account"}
                    </h2>
                </div>
                {isLogin ? <LoginForm/> : <RegistrationForm/>}

                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin)
                        }}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        {isLogin
                            ? "Don't have an account? Register"
                            : "Already have an account? Sign in"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;