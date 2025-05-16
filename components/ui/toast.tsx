import * as Toast from "@radix-ui/react-toast";
import { useState } from "react";

export const ToastComponent = () => {
  const [open, setOpen] = useState(false);

  const handleOpenToast = () => setOpen(true);
  const handleCloseToast = () => setOpen(false);

  return (
    <>
      {/* Trigger Button for Toast */}
      <button onClick={handleOpenToast}>Show Toast</button>

      {/* Toast Notification */}
      <Toast.Provider>
        <Toast.Root open={open} onOpenChange={setOpen}>
          <Toast.Title>Success</Toast.Title>
          <Toast.Description>
            This is a custom toast notification!
          </Toast.Description>
          <Toast.Action altText="Close" onClick={handleCloseToast}>
            Close
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </>
  );
};
