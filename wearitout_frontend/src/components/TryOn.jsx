import {color, motion} from "framer-motion";
import 'bootstrap/dist/css/bootstrap.min.css';
import Carousel from 'react-bootstrap/Carousel';

const TryOn = () => {
    const examples = [
        {
            person: "/assets/images/tryon/model1.png",
            garment: "/assets/images/tryon/garment1.png",
            result: "/assets/images/tryon/result1.png",
        },
        {
            person: "/assets/images/tryon/model2.png",
            garment: "/assets/images/tryon/garment2.png",
            result: "/assets/images/tryon/result2.png",
        },
        {
            person: "/assets/images/tryon/model3.png",
            garment: "/assets/images/tryon/garment3.png",
            result: "/assets/images/tryon/result3.png",
        },
    ];

    const images = [
        "/assets/images/tryon/clothing1.webp",
        "/assets/images/tryon/clothing7.webp",
        "/assets/images/tryon/clothing4.jpg",
        "/assets/images/tryon/clothing6.jpg",
        "/assets/images/tryon/clothing5.jpg",
    ];

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex flex-column align-items-center py-5" style={{ backgroundColor: "#e0f7fa" }}>
            <motion.div
                className="bg-white p-4 rounded shadow text-center w-75 mb-10"
                whileHover={{scale: 1.05}}
                transition={{duration: 0.3}}
            >
                <h1 className="text-primary fw-bold display-1 text-uppercase" style={{ fontFamily: "Poppins, sans-serif" }}>Trải nghiệm thử đồ ảo!</h1>
                <p className="text-muted">Thay đổi trang phục trong tích tắc với công nghệ AI.</p>
                <Carousel className="w-100" interval={1000} indicators={false} controls={true}>
                    {images.map((src, index) => (
                        <Carousel.Item key={index}>
                            <motion.img
                                src={src}
                                alt={`Try On Preview ${index + 1}`}
                                className="rounded shadow w-100 img-fluid"
                                whileHover={{scale: 1.1}}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </motion.div>
            <div className="my-5 text-center">
                <motion.a
                    href="https://huggingface.co/spaces/Kwai-Kolors/Kolors-Virtual-Try-On"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-xxxxxl btn-warning px-10 py-8 shadow-lg fw-bold text-uppercase fs-1 rounded-pill border border-dark"
                    whileHover={{scale: 1.8, backgroundColor: "#ffcc00", color: "#000"}}
                    whileTap={{scale: 0.9}}
                    transition={{duration: 0.2}}
                >
                    🚀 Thử đồ ngay!
                </motion.a>
            </div>

            <div className="w-75 bg-white p-4 rounded shadow text-center">
                <h2 className="text-dark fw-bold mb-3">Virtual Try-On Examples</h2>
                <div className="table-responsive">
                    <table className="table table-bordered text-center align-middle">
                        <thead className="bg-primary text-white"  style={{ fontFamily: "Poppins, sans-serif" }}>
                        <tr>
                            <th className="p-3 text-center border border-dark">Person</th>
                            <th className="p-3 text-center border border-dark">Garment</th>
                            <th className="p-3 text-center border border-dark">Result</th>
                        </tr>
                        </thead>
                        <tbody>
                        {examples.map((item, index) => (
                            <tr key={index}>
                                <td className="align-middle border border-dark">
                                    <img src={item.person} alt="Person" className="img-fluid rounded align-middle"
                                         style={{width: "180px", height: "180px", objectFit: "cover"}}/>
                                </td>
                                <td className="align-middle border border-dark">
                                    <img src={item.garment} alt="Garment" className="img-fluid rounded"
                                         style={{width: "180px", height: "180px", objectFit: "cover"}}/>
                                </td>
                                <td className="align-middle border border-dark">
                                    <img src={item.result} alt="Result" className="img-fluid rounded align-middle"
                                         style={{width: "180px", height: "180px", objectFit: "cover"}}/>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    );
};
export default TryOn;
