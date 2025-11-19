// components/ConfirmLogoutModal.jsx
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function ConfirmLogoutModal({ trigger }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    sessionStorage.removeItem('admin');
    setOpen(false);
    navigate('/login');
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        {trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90%] max-w-md bg-white rounded-lg shadow-xl p-6 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Dialog.Title className="text-lg font-bold text-gray-900">Confirm Logout</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">
            Are you sure you want to logout? This action cannot be undone.
          </Dialog.Description>
          <div className="mt-4 flex justify-end gap-4">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded bg-gray-200 text-sm">Cancel</button>
            </Dialog.Close>
            <button onClick={handleConfirm} className="px-4 py-2 rounded bg-red-500 text-white text-sm hover:bg-red-600">
              Logout
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
