import React from "react";
import { Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css";

const NotificationManager = {
    /**
     * Hiển thị notification
     * @param {string} title - Tiêu đề của thông báo
     * @param {string} message - Nội dung của thông báo
     * @param {string} type - Loại thông báo: "success", "danger", "info", "default", "warning"
     */
    showNotification: (title, message, type = "info") => {
        Store.addNotification({
            title: title,
            message: message,
            type: type,
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true,
            },
        });
    },
};

export default NotificationManager;
