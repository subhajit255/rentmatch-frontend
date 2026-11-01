import React from 'react';

interface PercentageViewerProps {
    percentage: number;
}

const PercentageViewer: React.FC<PercentageViewerProps> = ({ percentage }) => {
    const radius = 30; // Radius of the circle
    const strokeWidth = 2; // Width of the stroke
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex items-center justify-center relative">
            <svg width="65" height="65">
                <circle
                    stroke="#e6e6e6"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke="#4a90e2"
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
            </svg>
            <div className="absolute">{percentage}%</div>
        </div>
    );
};

export default PercentageViewer;
