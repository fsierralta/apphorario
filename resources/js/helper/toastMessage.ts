import { toast } from "react-toastify";

export default  function toastMessage(message: string, type: 'success' | 'error' | 'warning' | 'info'| 'message') {
    switch (type) {
        case 'success':
            toast.success(message);
            break;
        case 'error':
            toast.error(message);
            break;
        case 'warning':
            toast.warning(message);
            break;
        case 'info':
        case 'message':
            toast.info(message);
            break;
    }
}
