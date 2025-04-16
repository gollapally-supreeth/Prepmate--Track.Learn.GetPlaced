
import { Action } from "./toast-types"

// Counter for generating unique IDs
let count = 0

// Generate unique ID for toasts
export function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

// Map for tracking toast timeouts
export const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Global dispatch function that will be set when the provider is mounted
export let dispatch: React.Dispatch<Action>

// Function to set the dispatch function from the provider
export function setDispatch(dispatchFn: React.Dispatch<Action>) {
  dispatch = dispatchFn
}

// Add toast to removal queue
export const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, 1000000) // Using TOAST_REMOVE_DELAY = 1000000

  toastTimeouts.set(toastId, timeout)
}
