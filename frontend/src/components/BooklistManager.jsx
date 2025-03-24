import React, { useState, useEffect } from "react";

// Componente principal
const BooklistManager = () => {
    const [booklists, setBooklists] = useState([]);
    const [currentBooklist, setCurrentBooklist] = useState(null);

    // Carrega todas as tarefas
    useEffect(() => {
        displayAllBooklists();
    }, []);

    const fetchAllBooklists = async () => {
        const response = await sendGET("http://localhost:8080/api/booklists");
        return response;
    };

    const fetchBooklistWithName = async (name) => {
        const response = await sendGET(`http://localhost:8080/api/booklists/byName/${name}`);
        return response;
    };

    const sendGET = async (url) => {
        const response = await fetch(url, {
            headers: { Accept: "application/json" },
        });
        return response.ok ? response.json() : [];
    };

    const sendPOST = async (url, data) => {
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
    };

    const sendDELETE = async (url) => {
        await fetch(url, {
            method: "DELETE",
        });
    };

    const displayAllBooklists = async () => {
        const booklists = await fetchAllBooklists();
        setBooklists(booklists);
    };


    const displayBooklist = async (name) => {
        const booklist = await fetchBooklistWithName(name);
        setCurrentBooklist(booklist);
    };

    const deleteBooklist = async (name) => {
        await sendDELETE(`http://localhost:8080/api/booklists/${name}`);
        setCurrentBooklist(null);
        displayAllBooklists();
    };

    const addNewBooklist = (booklist) => {
        sendPOST("http://localhost:8080/api/booklists", booklist);
    };

    const buildBooklistFromForm = (event) => {
        event.preventDefault();
        const form = event.target;
        const booklist = {
            userId: form.newBooklistUserId.value,
            name: form.newBooklistName.value,
            description: form.newBooklistDescription.value,
        };
        addNewBooklist(booklist);
        displayAllBooklists();
    };

    return (
        <div>
            <h1>Booklist Manager Client</h1>

            {/* Formulários de interações */}
            <form onSubmit={(e) => { e.preventDefault(); displayAllBooklists(); }}>
                <span>View all the booklists </span>
                <input type="submit" value="Go" />
            </form>

            {/* Formulário para adicionar nova tarefa */}
            <form name="addBooklistForm" onSubmit={buildBooklistFromForm}>
                <span>Create new booklist with </span>
                
                <br/>
                <label htmlFor="newBooklistUserId"><b>User: </b></label>
                <input type="number" id="newBooklisUserId" name="newBooklistUserId" size="10" />
                
                <br/>
                <label htmlFor="newBooklistName"><b>Name: </b></label>
                <input type="text" id="newBooklistName" name="newBooklistName" size="10" />
                
                <br/>
                <label htmlFor="newBooklistDescription"><b>Description: </b></label>
                <input
                    type="text"
                    id="newBooklistDescription"
                    name="newBooklistDescription"
                    size="20"
                />
                <br/>
                <input type="submit" value="Go" />
            </form>

            <hr />
            <div>
                Current booklist is{" "}
                <em>{currentBooklist ? `booklist: ${currentBooklist.name} - ${currentBooklist.description}` : "None"}</em>
            </div>
            <hr />

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {booklists.map((booklist) => (
                        <tr key={booklist.name}>
                            <td>{booklist.name}</td>
                            <td>
                                <a href="#!" onClick={() => displayBooklist(booklist.name)}>
                                    View
                                </a>
                            </td>
                            <td>
                                <a href="#!" onClick={() => deleteBooklist(booklist.name)}>
                                    Delete
                                </a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BooklistManager;
