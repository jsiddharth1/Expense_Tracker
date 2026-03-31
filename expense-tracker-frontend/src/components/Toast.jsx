import React, { useEffect, useState } from 'react';

const Toast = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300);
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bg = type === 'success' ? '#4CAF50' : '#f44336';

    return (
        <div style={{
            ...styles.toast,
            background: bg,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
        }}>
            <span style={styles.icon}>{type === 'success' ? '✅' : '❌'}</span>
            <span>{message}</span>
            <button style={styles.close} onClick={onClose}>×</button>
        </div>
    );
};

const ToastContainer = ({ toasts, removeToast }) => (
    <div style={styles.container}>
        {toasts.map(t => (
            <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
    </div>
);

const styles = {
    container: {
        position: 'fixed', bottom: '24px', right: '24px',
        display: 'flex', flexDirection: 'column', gap: '10px',
        zIndex: 9999,
    },
    toast: {
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '12px 18px', borderRadius: '10px',
        color: 'white', fontSize: '14px', fontWeight: '500',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        minWidth: '260px', maxWidth: '380px',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
    },
    icon: { fontSize: '16px' },
    close: {
        marginLeft: 'auto', background: 'transparent',
        border: 'none', color: 'white', fontSize: '18px',
        cursor: 'pointer', lineHeight: 1,
    },
};

export default ToastContainer;

// Custom hook for toast management
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return { toasts, showToast, removeToast };
};
