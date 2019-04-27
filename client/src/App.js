import React, {useEffect, useState} from 'react';
import Uppy from "./Uppy";

const fetchService = (request) => {
    return new Promise(resolve => {
        fetch(request)
            .then(response => { return response.json(); })
            .then(data => {
                resolve(data);
            }).catch(e=> {
            console.log(e)
        })
    })
}

const App = () => {
    const [files, setFiles] = useState([]);
    const updateFilesList = () => {
        const myRequest = new Request('/files');
        fetchService(myRequest).then(data=>{
            const {files = []} = data;
            setFiles(files);
        })
    };
    useEffect(()=>{
        updateFilesList();
    },[]);

    const onClick = file => () =>{
        const myRequest = new Request('/delete', {
            method:'POST',
            body: JSON.stringify({file}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        fetchService(myRequest).then(data => {
            updateFilesList();
        })
    };

    return (
        <div className="App">
            <Uppy uploadDone={updateFilesList}/>
            <ul>
                {files.map(file => {
                    return <li key={file}><a href={`/${file}`}>{file}</a> | <a style={{cursor:'pointer', color: 'blue'}} onClick={onClick(file)}>delete</a></li>
                })}
            </ul>
        </div>
    );
}

export default App;
