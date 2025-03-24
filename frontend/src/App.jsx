import { useEffect, useState } from "react";
import BooklistManager from "./components/BooklistManager";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/")
            .then((res) => res.text())
            .then(setMessage);
    }, []);

    return <BooklistManager />;
}

export default App;
