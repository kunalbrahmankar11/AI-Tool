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
    <div className="grid grid-cols-1 lg:grid-cols-5 h-screen text-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
      {/* Sidebar (hidden on mobile) */}
      <div className="hidden lg:block col-span-1 bg-gradient-to-b from-indigo-800 to-purple-800 shadow-xl">
        <h2 className="text-white text-xl font-bold p-6">AI Tool</h2>
      </div>

      {/* Main Content */}
      <div className="col-span-4 p-4 sm:p-6 lg:p-10 flex flex-col">
        {/* Answers container */}
        <div className="container flex-1 overflow-y-auto mb-4">
          <div className="text-white">
            <ul>
              {result && result.map((item, idx) => (
                <li 
                  key={idx} 
                  className="text-left p-2 mb-2 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
                >
                  <Answer ans={item} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Input Box */}
        <div className="bg-zinc-900 w-full sm:w-3/4 lg:w-1/2 p-1 pr-2 text-white m-auto rounded-3xl
        border border-zinc-700 flex h-14 sm:h-16 mb-6 shadow-lg">
          <input
            type="text"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && question.trim() !== "") {
                askQuestion();
              }
            }}
            className="w-full h-full p-3 outline-none bg-transparent text-sm sm:text-base placeholder-gray-400"
            placeholder="✨ Ask me anything..."
          />
          
          <button
            onClick={askQuestion}
            className="px-4 sm:px-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 
            hover:from-indigo-600 hover:via-purple-600 hover:to-pink-500 
            rounded-2xl ml-2 font-semibold shadow-md transition-all duration-300"
          >
            Ask 🚀
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
