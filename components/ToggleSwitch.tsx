import React from 'react';

interface ToggleSwitchProps {
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange }) => {
    const handleClick = () => {
        onChange(!enabled);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`${
                enabled ? 'bg-green-600' : 'bg-stone-300'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-offset-2`}
            role="switch"
            aria-checked={enabled}
            aria-label={enabled ? "Disable item" : "Enable item"}
        >
            <span className="sr-only">Toggle visibility</span>
            <span
                aria-hidden="true"
                className={`${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    );
};

export default ToggleSwitch;
