import React from 'react';

function VideoBG() {
    return (
        <div className="absolute inset-0 pointer-events-none">
            <video
                src="/highwayHyperlapse.mp4"
                type="video/mp4"
                loop
                muted
                autoPlay
                playsInline
                className="w-full h-full object-cover"
            />
            {/* Dark Overlay - moved inside to properly stack above video */}
            <div className="absolute inset-0 bg-black opacity-70 pointer-events-none"></div>
        </div>
    )
}

export default VideoBG;