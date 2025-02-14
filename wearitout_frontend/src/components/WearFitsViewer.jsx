import { useEffect } from "react";

const WearFitsViewer = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://dev.wearfits.com/static/js/wearfits.fr.bundle.min.js";
        script.async = true;
        script.onload = () => {
            if (window.wearfits) {
                window.wearfits.current_garment_name = "Rozowa";
                window.wearfits.loadDefaultOrCreateIt();
                window.wearfits.showMaterialPresets = true;
                window.wearfits.showSizeSelectionUI = true;
                window.wearfits.showAvatarSelectionUI = true;
                window.wearfits.showComfortMapButton = true;
            }
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="flex justify-center items-center h-screen">
            <div id="wearfits_viewer" className="w-1/2 h-3/5 m-10"></div>
        </div>
    );
};

export default WearFitsViewer;
