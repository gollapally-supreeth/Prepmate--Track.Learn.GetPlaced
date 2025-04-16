
import * as React from "react"
import { ToastContext } from "./toast/toast-context"
import { Toast, ToasterToast } from "./toast/toast-types"

// Hook to use the toast context
export function useToast() {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  
  return {
    toasts: context.state.toasts,
    toast: context.toast,
    dismiss: context.dismiss,
  };
}

// Singleton toast function for use outside of React components
export const toast = (function() {
  // This function will be replaced when the context is available
  function toastFunction(props: Toast) {
    throw new Error("toast provider not found");
  }
  
  return toastFunction;
})() as {
  (props: Toast): {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  };
};
