import { useState, useCallback } from "react";

let _id = 0;

/**
 * useToast — returns { toasts, showToast, removeToast }
 *
 * showToast(message, type)
 *   type: "success" | "error" | "info" | "warning"
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 3500) => {
      const id = ++_id;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), duration);
      return id;
    },
    [removeToast]
  );

  return { toasts, showToast, removeToast };
}
