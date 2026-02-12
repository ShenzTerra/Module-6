
import React from 'react';

interface ClayButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'black';
  disabled?: boolean;
}

const ClayButton: React.FC<ClayButtonProps> = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'blue',
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`clay-btn clay-btn-${variant} px-6 py-3 rounded-2xl font-bold uppercase tracking-wider text-sm ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};

export default ClayButton;
