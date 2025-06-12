import { toast } from 'sonner';

/**
 * Utility functions for displaying toast notifications
 */
export const showToast = {
  /**
   * Display a success toast
   * @param title The title of the toast
   * @param message Optional message for the toast
   */
  success: (title: string, message?: string) => {
    toast.success(title, {
      description: message,
    });
  },
  
  /**
   * Display an error toast
   * @param title The title of the toast
   * @param message Optional message for the toast
   */
  error: (title: string, message?: string) => {
    toast.error(title, {
      description: message,
    });
  },
  
  /**
   * Display an info toast
   * @param title The title of the toast
   * @param message Optional message for the toast
   */
  info: (title: string, message?: string) => {
    toast.info(title, {
      description: message,
    });
  },
  
  /**
   * Display a warning toast
   * @param title The title of the toast
   * @param message Optional message for the toast
   */
  warning: (title: string, message?: string) => {
    toast.warning(title, {
      description: message,
    });
  },
  
  /**
   * Display a loading toast that can be updated
   * @param title The title of the toast
   * @param message Optional message for the toast
   * @returns A promise and a toastId that can be used to update the toast
   */
  loading: (title: string, message?: string) => {
    return toast.loading(title, {
      description: message,
    });
  }
};
