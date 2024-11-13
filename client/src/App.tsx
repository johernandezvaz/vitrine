import { useEffect, useState } from 'react';


interface Message {
  message: string;
}

function App(){
  const [message, setMessage] = useState<string>('');


  useEffect(() => {

    fetch('http://127.0.0.1:5000/api/hello')
    .then((response) => response.json() as Promise<Message>)
    .then((data) => setMessage(data.message))
    .catch((error) => console.error("Error recuperando datos", error));

  },[]);

  return ( 
    <div className = "App">
      <h1>Mensaje desde Rust:</h1>
      <p>{message}</p>
      </div>
  );
}

export default App;