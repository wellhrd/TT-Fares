import React, { useState, useEffect, useRef } from 'react';
import * as THREE from "three";
import NET from "vanta/dist/vanta.net.min";

const VantaBackground = () => {
    const vantaRef = useRef(null);
    const [vantaEffect, setVantaEffect] = useState(null);

    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(
                NET({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    scale: 1.0,
                    scaleMobile: 1.0,
                    color: "#e82800",
                    backgroundColor: "#202823",
                })
            );
        }

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);



return (
   <div
      ref={vantaRef}
      style={{
        width: "100%",
        height: "25vh", // Top 1/4 of the page
        position: "relative",
        zIndex: 0.5,
      }}
    >
      {/* Optional content in top quarter */}
    </div>
  );

};

export default VantaBackground;
// // Other script 
// <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js"></script>
// <script>
// var setVanta = ()=>{
// if (window.VANTA) window.VANTA.NET({
//   el: ".s-page-1 .s-section-1 .s-section",
//   mouseControls: true,
//   touchControls: true,
//   gyroControls: false,
//   minHeight: 200.00,
//   minWidth: 200.00,
//   scale: 1.00,
//   scaleMobile: 1.00,
//   color: 0xe82800,
//   backgroundColor: 0x202823
// })
// }
// _strk.push(function() {
//   setVanta()
//   window.edit_page.Event.subscribe( "Page.beforeNewOneFadeIn", setVanta )
// })
// </script>