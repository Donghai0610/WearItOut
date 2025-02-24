import { useEffect } from "react";
import {motion} from "framer-motion";

const WearFitsViewer = () => {


    return (
        <div className="my-5 text-center">
            <motion.a
                href="https://dev.wearfits.com/demo"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-xxxxxl btn-warning px-10 py-8 shadow-lg fw-bold text-uppercase fs-1 rounded-pill border border-dark"
                whileHover={{scale: 1.8, backgroundColor: "#ffcc00", color: "#000"}}
                whileTap={{scale: 0.9}}
                transition={{duration: 0.2}}
            >
                🚀 Check Outfit!
            </motion.a>
        </div>
    );
};

export default WearFitsViewer;
