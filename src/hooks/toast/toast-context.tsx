
import * as React from "react"
import { State, Toast, ToasterToast, Action } from "./toast-types"
import { reducer } from "./toast-reducer"
import { genId, setDispatch } from "./toast-utils"

// Initial state
const initialState: State = { toasts: [] }

// Create context
export const ToastContext = React.createContext<{
  state: State;
  toast: (props: Toast) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void };
  dismiss: (toastId?: string) => void;
} | undefined>(undefined)

// Toast Provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // Set the global dispatch function when the provider is mounted
  React.useEffect(() => {
    setDispatch(dispatch)
  }, [dispatch])

  const toast = React.useCallback(
    function toast({ ...props }: Toast) {
      const id = genId();

      const update = (props: ToasterToast) =>
        dispatch({
          type: "UPDATE_TOAST",
          toast: { ...props, id },
        });
      
      const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

      dispatch({
        type: "ADD_TOAST",
        toast: {
          ...props,
          id,
          open: true,
          onOpenChange: (open) => {
            if (!open) dismiss();
          },
        },
      });

      return {
        id: id,
        dismiss,
        update,
      };
    },
    [dispatch]
  );

  const dismiss = React.useCallback(
    (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
    [dispatch]
  );

  return (
    <ToastContext.Provider value={{ state, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}
