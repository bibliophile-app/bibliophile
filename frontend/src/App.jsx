import { useEffect, useState } from "react";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/")
            .then((res) => res.text())
            .then(setMessage);
    }, []);

    return <h1>{message}</h1>;
}

export default App;
