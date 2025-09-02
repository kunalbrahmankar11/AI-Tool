import { useState } from 'react'
import './App.css'
import { URL } from './constants';
import Answer from './components/Answers';

function App() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState(undefined);

  const payload = {
    "contents": [
      {
        "parts": [{ "text": question }]
      }
    ]
  }

  const askQuestion = async () => {
    let response = await fetch(URL, {
      method: "post",
      headers: {
        "Content-Type": "application/json",   // ✅ you’re missing this
      },
      body: JSON.stringify(payload),
    });

    response = await response.json();
    // let dataString = response.candidates[0].content.parts[0].text;
    let dataString = response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    dataString = dataString.split("* ");
    dataString = dataString.map((item) => item.trim());

    console.log(dataString);
    setResult(dataString);

  }

  return (
    <div className='grid grid-cols-5 h-screen text-center'>
      <div className='col-span-1 bg-zinc-800'>

      </div>

      <div className='col-span-4 p-10'>
        <div className='container h-110 overflow-scroll'>
          <div className='text-white '>
            <ul>
              {
                result && result.map((item, idx) => (
                  <li key={idx} className="text-left p-1">
                    <Answer ans={item} />
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
        <div className='bg-zinc-800 w-1/2 p-1 pr-5 text-white m-auto rounded-4xl
        border border-zinc-700 flex h-16'>

          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && question.trim() !== "") {
                askQuestion();
              }
            }}
            className="w-full h-full p-3 outline-none"
            placeholder="Ask me anything"
          />


          {/* <input type="text" value={question} onChange={(event) => setQuestion(event.target.value)} 
          className='w-full h-full p-3 outline-none' placeholder='Ask me anything' /> */}
          <button onClick={askQuestion}>Ask</button>

        </div>
      </div>
    </div>
  )
}

export default App
