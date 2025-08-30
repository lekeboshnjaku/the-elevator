import React, { FC } from 'react';

// Base64 encoded background image data.
const futuristicElevatorShaftBg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoGBxMUExYUFBQYGBYZGhocGRoYGhsZGhsdHBsgHx4dHx4dHywiHyAmHhodIjQjKS0uMTMzGSI4QDQwPSgxPzcBCwsLDw4PHRERHTAnIikxMDIxMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMTExMv/AABEIAKcBLwMBIgACEQEDEQH/xAbAAACAwEBAQAAAAAAAAAAAAADBAABAgUGB//EADkQAAIBAgQDBgQEBQQDAQAAAAABAgMRBBIhMQVBURMiYXEygZGhFCNCscHR4fDxBhVScoJTYpKyM//EABgBAQEBAQEAAAAAAAAAAAAAAAABAgME/8QAHBEBAQEBAQEAAwEAAAAAAAAAAAERAhIhMQNBIv/aAAwDAQACEQMRAD8A9XATsBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQE-';

const CautionStrips: FC = () => (
    <>
        <style>{`
            .caution-strip {
                position: fixed; /* Use fixed positioning to ignore parent overflow */
                width: 300px;
                height: 50px;
                background: repeating-linear-gradient(
                    -45deg,
                    #facc15,
                    #facc15 20px,
                    #111827 20px,
                    #111827 40px
                );
                opacity: 0.6;
                box-shadow: 0 0 15px rgba(250, 204, 21, 0.2);
                border: 1px solid rgba(0,0,0,0.5);
                z-index: 5; /* Position above background but below most UI */
                pointer-events: none; /* Make sure they don't block clicks */
            }
        `}</style>
        {/* Top-left */}
        <div className="caution-strip" style={{ top: '20px', left: '-80px', transform: 'rotate(-45deg)' }} />
        {/* Top-right */}
        <div className="caution-strip" style={{ top: '20px', right: '-80px', transform: 'rotate(45deg)' }} />
        {/* Bottom-left */}
        <div className="caution-strip" style={{ bottom: '20px', left: '-80px', transform: 'rotate(45deg)' }} />
        {/* Bottom-right */}
        <div className="caution-strip" style={{ bottom: '20px', right: '-80px', transform: 'rotate(-45deg)' }} />
    </>
);

const ElevatorShaftBackground: FC = () => {
    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-black z-0">
            <style>{`
                .animated-bg {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    background-image: url('${futuristicElevatorShaftBg}');
                    background-size: cover;
                    background-position: center;
                }
            `}</style>
            <div className="animated-bg"></div>
             {/* Caution strips overlay */}
            <CautionStrips />
            {/* Vignette overlay for a more cinematic feel */}
            <div 
                className="absolute inset-0 z-10"
                style={{ boxShadow: 'inset 0 0 15vw 5vw #020617' }}
            ></div>
        </div>
    );
};

export default ElevatorShaftBackground;