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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text;

    dataString = dataString.split("* ");
    dataString = dataString.map((item) => item.trim());

    console.log(dataString);
    setResult(dataString);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 h-screen text-center">
      {/* Sidebar (hidden on mobile) */}
      <div className="hidden lg:block col-span-1 bg-zinc-800">
      </div>

      {/* Main Content */}
      <div className="col-span-4 p-4 sm:p-6 lg:p-10 flex flex-col">
        {/* Answers container */}
        <div className="container flex-1 overflow-y-auto mb-4">
          <div className="text-white">
            <ul>
              {result && result.map((item, idx) => (
                <li key={idx} className="text-left p-1">
                  <Answer ans={item} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Input Box */}
        <div className="bg-zinc-800 w-full sm:w-3/4 lg:w-1/2 p-1 pr-2 text-white m-auto rounded-3xl
        border border-zinc-700 flex h-14 sm:h-16">
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && question.trim() !== "") {
                askQuestion();
              }
            }}
            className="w-full h-full p-3 outline-none bg-transparent text-sm sm:text-base"
            placeholder="Ask me anything..."
          />
          <button
            onClick={askQuestion}
            className="px-3 sm:px-5 bg-blue-600 hover:bg-blue-700 rounded-2xl ml-2"
          >
            Ask
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
