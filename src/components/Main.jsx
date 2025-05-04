import React, {useEffect, useRef, useState} from "react";
import Navbar from "./Navbar";
import Home from "./Home";
import Sidebar from "./Sidebar";
import News from "./News";
import Footer from "./Footer";

export default function Main() {
    const [news, setNews] = useState([]);
    const [menu, setMenu] = useState("");
    const [search, setSearch] = useState("");
    const categoryMap = {
        "U.S.": "us.json",
        "World": "world.json",
        "Business": "busi.json",
        "Arts": "arts.json",
        "Lifestyle": "lifestyle.json",
        "Opinion": "optinion.json",
        "Audio": "audio.json",
        "Games": "games.json",
        "Cooking": "cooking.json",
        "Wirecutter": "wirecut.json",
        "The Athletic": "athlet.json",
    };
    const [category, setCategory] = useState(categoryMap[menu] || "us.json");
    const [hideCategories, setHideCategories] = useState(false);

    const searchRef = useRef(null);

    const getNews = async () => {
        try {
            // Dynamically fetch the JSON file based on the selected category
            const fileName = categoryMap[menu] || "us.json";
            const response = await fetch(`/${fileName}`);
            const json = await response.json();
            if (json.articles) {
                setNews(json.articles);
            }
        } catch (err) {
            console.error("Error fetching news:", err);
        }
    };

    useEffect(() => {
        getNews();
    }, [menu]); // Re-fetch news whenever the menu (category) changes


    return (
        <div>
            <Navbar setMenu={setMenu} setSearch={setSearch} searchRef={searchRef} />
            <div className="container py-5">
                <div className="row">
                    <div className="col-lg-8 col-md-12">
                        <Home news={news} num="6" />
                    </div>
                    <div className="col-lg-4 col-md-12">
                        <Sidebar news={news} />
                    </div>
                </div>
            </div>
            <News news={news} search={search} searchRef={searchRef} />
            <Footer />
        </div>
    );
}
