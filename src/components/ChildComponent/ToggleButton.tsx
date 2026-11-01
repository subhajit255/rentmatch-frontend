import React, { useState } from 'react';

// const ToggleButton: React.FC = () => {
//     const [isToggled, setIsToggled] = useState<boolean>(false);

//     const toggle = () => {
//         setIsToggled(!isToggled);
//     };
interface ToggleButtonProps {
    isToggled: boolean;
    onToggle?: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isToggled, onToggle }: ToggleButtonProps) => {

    // const toggle = () => {
    //     setIsToggled(!isToggled);
    // };

    return (
        <button
            onClick={onToggle}
            className={`cursor-pointer flex items-center w-[49px] h-[25px] rounded-full transition-colors duration-300 
                ${isToggled ? 'bg-[#38AC7930]' : 'bg-[#EFEFEF]'}`}
        >
            <div
                className={`w-[18px] h-[18px] rounded-full shadow-md transform transition-transform duration-300 
                    ${isToggled ? 'translate-x-[26px] bg-active' : 'translate-x-[4px] bg-[#A3ABB0]'}`}
            />
        </button>
    );
};

export default ToggleButton;
