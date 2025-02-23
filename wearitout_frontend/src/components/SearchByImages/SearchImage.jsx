import React, { useState } from "react";

const SearchImage = () => {
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);

    let API_KEY = "uGj5mxmIILPu8Aci9nVMCYDvbU_NEM177EFymc_oZMo";

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const getData = async () => {
        await myFun(search);
    };

    const myFun = async (searchVal) => {
        const get = await fetch(
            `https://api.unsplash.com/search/photos?page=1&query=${searchVal}&client_id=${API_KEY}`
        );
        const jsonData = await get.json();
        setData(jsonData.results);
    };

    // Định nghĩa CSS trong object
    const styles = {
        body: {
            margin: 0,
            fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
        },
        container: {
            textAlign: "center",
        },
        inputs: {
            display: "flex",
            gap: "3px",
            justifyContent: "center",
            padding: "33px",
        },
        input: {
            width: "450px",
            padding: "15px",
            fontSize: "20px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#e0dada",
        },
        button: {
            width: "80px",
            border: "none",
            backgroundColor: "orange",
            color: "white",
            fontSize: "20px",
            borderRadius: "4px",
            cursor: "pointer",
        },
        images: {
            width: "100%",
            margin: "auto",
            backgroundColor: "black",
            textAlign: "center",
            marginTop: "22px",
        },
        image: {
            padding: "31px",
            width: "300px",
            height: "300px",
        },
    };

    return (
        <>
            <div style={styles.container}>
                <h1>Image Search By WearItOut</h1>
                <div style={styles.inputs}>
                    <input type="text" placeholder="Search Images.." onChange={handleSearch} style={styles.input} />
                    <button onClick={getData} style={styles.button}>Search</button>
                </div>
                <div style={styles.images}>
                    {data.map((curVal, _) => {
                        return <img key={curVal.id} src={curVal.urls.full} alt={curVal.alt_description || "Image"} style={styles.image} />;
                    })}
                </div>
            </div>
        </>
    );
};

export default SearchImage;
