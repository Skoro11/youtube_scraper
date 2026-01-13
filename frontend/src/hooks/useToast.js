import { useState, useCallback } from "react";

export function useToast(duration = 3000) {
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = useCallback(
    (message, type = "success") => {
      setToast({ show: true, message, type });
      setTimeout(() => {
        setToast({ show: false, message: "", type: "" });
      }, duration);
    },
    [duration]
  );

  const hideToast = useCallback(() => {
    setToast({ show: false, message: "", type: "" });
  }, []);

  return { toast, showToast, hideToast };
}
