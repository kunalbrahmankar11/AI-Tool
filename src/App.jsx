import { useRef, useState } from "react";
import "./App.css";
import { URL } from "./constants";
import Answer from "./components/Answers";

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem("history")) || []
  );
  const [showHistory, setShowHistory] = useState(false);
  const scrollToAns = useRef();
  const [loader, setLoader] = useState('');


  const payload = {
    contents: [
      {
        parts: [{ text: question }],
      },
    ],
  };

  const askQuestion = async () => {
    if (localStorage.getItem("history")) {
      let history = JSON.parse(localStorage.getItem("history"));
      history = [question, ...history];
      localStorage.setItem("history", JSON.stringify(history));
      setRecentHistory(history);
    } else {
      localStorage.setItem("history", JSON.stringify([question]));
      setRecentHistory([question]);
    }
    setLoader(true);
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

    setResult([
      ...result,
      { type: "q", text: question },
      { type: "a", text: dataString },
    ]);
    setTimeout(() => {
      scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
    }, 500)
    setLoader(false);
  };

  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  };

  const runHistoryItem = (item) => {
    setQuestion(item);   // show in input
    askQuestion(item);   // run the API again with this history item
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 h-screen text-center">
      {/* Sidebar (desktop only) */}
      <div className="hidden lg:flex flex-col col-span-1 bg-zinc-800 pt-3">
        <h1 className="text-xl text-white flex justify-center items-center px-2">
          <span>Recent History</span>
          <button
            onClick={clearHistory}
            className="pl-2 pt-1 cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="23px"
              width="23px"
              viewBox="0 -960 960 960"
              fill="currentColor"
            >
              <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
            </svg>
          </button>
        </h1>
        <ul className="text-left overflow-auto text-sm flex-1">
          {recentHistory.map((item, i) => (
            <li
              key={i}
              onClick={() => runHistoryItem(item)}
              className="truncate p-1 pl-5 text-zinc-100 cursor-pointer hover:bg-zinc-500 hover:text-green-500"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="col-span-4 flex flex-col h-screen p-3 sm:p-5 lg:p-8">
        {/* Mobile toggle header */}
        <div className="flex lg:hidden justify-between items-center bg-zinc-800 p-2 rounded-lg mb-2">
          <span className="text-white text-lg">Recent History</span>
          <div className="flex gap-2 items-center">
            {/* Clear history */}
            <button
              onClick={clearHistory}
              className="cursor-pointer text-gray-400 hover:text-red-500 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                width="20px"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
              </svg>
            </button>
            {/* Toggle button */}
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-white"
            >
              {showHistory ? (
                // Close icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible sidebar (mobile) */}
        {showHistory && (
          <div className="lg:hidden bg-zinc-800 p-3 rounded-lg mb-3 max-h-48 overflow-auto">
            <ul className="text-left text-sm">
              {recentHistory.map((item, i) => (
                <li
                  key={i}
                  className="truncate p-1 pl-5 text-zinc-100 cursor-pointer hover:bg-zinc-500 hover:text-green-500"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Answers container */}
        <h1 className=" pb-4 text-4xl bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-600">Hello User, Ask me Anything</h1>
        {
          loader ?
            <div className="text-center">
              <div role="status">
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div> : null


        }

        <div ref={scrollToAns} className="flex-1 overflow-y-auto mb-4 ">

          <div className="text-white">
            <ul className="w-full max-w-3xl mx-auto px-2 sm:px-3 py-1 space-y-1 sm:space-y-4 ">
              {result.map((queItem, queIndex) =>
                queItem.type === "q" ? (
                  <li key={`q-${queIndex}`} className="flex justify-end">
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl max-w-[80%] text-left text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed whitespace-pre-line shadow-md">
                      <Answer
                        ans={
                          queItem.text.charAt(0).toUpperCase() + queItem.text.slice(1)
                        }
                      />
                    </div>
                  </li>
                ) : (
                  queItem.type === "a" &&
                  queItem.text.map((ansItem, ansIndex) => (
                    <li key={`a-${queIndex}-${ansIndex}`} className="flex justify-start">
                      <div className="bg-zinc-700 text-white px-3 py-3 rounded-2xl max-w-[80%] text-left text-sm sm:text-base md:text-lg lg:text-xl leading-snug whitespace-pre-line shadow-md">
                        <Answer ans={ansItem} />
                      </div>
                    </li>
                  ))
                )
              )}
            </ul>

          </div>
        </div>

        {/* Input Box */}
        <div className="bg-zinc-800 w-full sm:w-3/4 lg:w-1/2 p-1 pr-2 text-white m-auto rounded-3xl border border-zinc-700 flex h-12 sm:h-14 lg:h-16 mb-3">
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
  );
}

export default App;
