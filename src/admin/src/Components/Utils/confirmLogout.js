// utils/confirmLogout.js
import toast from 'react-hot-toast';

export const confirmLogout = (onConfirm, onCancel = () => {}) => {
  toast((t) => (
    <span>
      Are you sure you want to logout?
      <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            sessionStorage.removeItem('admin');
            toast.success('Logged out!');
            onConfirm(); // navigation
          }}
          style={{
            padding: '4px 12px',
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Yes
        </button>
        <button
          onClick={() => {
            toast.dismiss(t.id);
            onCancel();
          }}
          style={{
            padding: '4px 12px',
            backgroundColor: '#6b7280',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </span>
  ), { duration: 5000 });
};
