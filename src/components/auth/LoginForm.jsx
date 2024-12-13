import React, {useState} from "react";
import {FiLock, FiMail} from "react-icons/fi";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {FaGithub, FaGoogle} from "react-icons/fa";
import Loading from "../helper/Loading.jsx";

const LoginForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setLoading(true);
                const response = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/auth/login/`,
                    formData
                );
                console.log("Login successful:", response.data);
                localStorage.setItem("access", response.data.access);
                localStorage.setItem("refresh", response.data.refresh);
                navigate("/home");
            } catch (error) {
                console.error("Login failed:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const goToReset = () => {
        try {
            setLoading(true);
            navigate('/reset');
        } finally {
            setLoading(false);
        }

    };

    const loginWithGoogle = async () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
        const newWindow = createNewWindow(authUrl);
        if (newWindow) {
            newWindow.focus();

            const code = await new Promise((resolve, reject) => {
                const timer = setInterval(() => {
                    try {
                        if (newWindow.closed) {
                            clearInterval(timer);
                            reject(new Error("Popup was closed before completing the login process."));
                        }

                        if (newWindow.location.href.includes(redirectUri)) {
                            const urlParams = new URLSearchParams(newWindow.location.search);
                            const authCode = urlParams.get("code");
                            if (authCode) {
                                clearInterval(timer);
                                newWindow.close();
                                resolve(authCode);
                            }
                        }
                    } catch (error) {
                    }
                }, 600);
            });

            try {
                setLoading(true);
                const googleTokenResponse = await getGoogleToken(code, clientId, import.meta.env.VITE_GOOGLE_SECRET, redirectUri);
                const loginResponse = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/auth/social/google/`,
                    {
                        access_token: googleTokenResponse.access_token,
                    }
                );

                console.log("Login successful:", loginResponse.data);
                localStorage.setItem("access", loginResponse.data.access);
                localStorage.setItem("refresh", loginResponse.data.refresh);
                navigate("/home");
            } catch (error) {
                console.error("Error during login process:", error);
            } finally {
                setLoading(false);
            }
        }
    }

    const getGoogleToken = async (code, clientId, clientSecret, redirectUri) => {
        try {
            const getTokenResponse = await axios.post(
                `https://oauth2.googleapis.com/token`,
                {
                    code: code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUri,
                    grant_type: "authorization_code",
                }
            );

            console.log("Access Token Response:", getTokenResponse.data);
            return getTokenResponse.data;
        } catch (error) {
            if (error.response) {
                console.error("Error Response Status:", error.response.status);
                console.error("Error Response Data:", error.response.data);
            } else if (error.request) {
                console.error("Error Request:", error.request);
            } else {
                console.error("Error Message:", error.message);
            }
        }
    }

    const loginWithGithub = async () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI;

        const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`
        const newWindow = createNewWindow(authUrl);
        if (newWindow) {
            newWindow.focus();

            const code = await new Promise((resolve, reject) => {
                const timer = setInterval(() => {
                    try {
                        if (newWindow.closed) {
                            clearInterval(timer);
                            reject(new Error("Popup was closed before completing the login process."));
                        }

                        if (newWindow.location.href.includes(redirectUri)) {
                            const urlParams = new URLSearchParams(newWindow.location.search);
                            const authCode = urlParams.get("code");
                            if (authCode) {
                                clearInterval(timer);
                                newWindow.close();
                                resolve(authCode);
                            }
                        }
                    } catch (error) {
                    }
                }, 600);
            });

            try {
                setLoading(true);
                const githubTokenResponse = await getGithubToken(code, clientId, import.meta.env.VITE_GITHUB_SECRET, redirectUri);
                const loginResponse = await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/api/auth/social/github/`,
                    {
                        access_token: githubTokenResponse.access_token,
                    }
                );

                console.log("Login successful:", loginResponse.data);
                localStorage.setItem("access", loginResponse.data.access);
                localStorage.setItem("refresh", loginResponse.data.refresh);
                navigate("/home");
            } catch (error) {
                console.error("Error during login process:", error);
            } finally {
                setLoading(false);
            }
        }
    }

    const getGithubToken = async (code, clientId, clientSecret, redirectUri) => {
        try {
            const getTokenResponse = await axios.post(
                `https://github.com/login/oauth/access_token`,
                {
                    code: code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUri
                }
            );

            console.log("Access Token Response:", getTokenResponse.data);
            return getTokenResponse.data;
        } catch (error) {
            if (error.response) {
                console.error("Error Response Status:", error.response.status);
                console.error("Error Response Data:", error.response.data);
            } else if (error.request) {
                console.error("Error Request:", error.request);
            } else {
                console.error("Error Message:", error.message);
            }
        }
    }

    const createNewWindow = (url) => {
        const screenWidth = window.screen.width;
        const screenHeight = window.screen.height;
        const left = (screenWidth - 500) / 2;
        const top = (screenHeight - 600) / 2;
        return window.open(url, "_blank", `width=500,height=600,top=${top},left=${left},scrollbars=yes,resizable=yes`);
    }

    return (
        <div className="relative">
            {loading && <Loading/>}
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="sr-only">
                        Email address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                            placeholder="Email address"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="sr-only">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiLock className="h-5 w-5 text-gray-400"/>
                        </div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500"
                            placeholder="Password"
                        />
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                    )}
                </div>

                <div className="flex items-center justify-end">
                    <button
                        type="button"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={goToReset}
                    >
                        Forgot your password?
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md"
                >
                    Sign in
                </button>
                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={loginWithGoogle}
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <FaGoogle className="h-5 w-5 text-red-500"/>
                            <span className="ml-2">Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={loginWithGithub}
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <FaGithub className="h-5 w-5 text-black"/>
                            <span className="ml-2">GitHub</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
