import "./App.css";
import React, {useState, useEffect, useRef} from "react";
import webSocket from "socket.io-client";

const App = () => {
  const chatBoxref = useRef(null);
  // const [player, setPlayer] = useState(flvUrl);

  const [ws, setWs] = useState(null);
  const [height, setHeight] = useState(window.innerHeight);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    if (ws) {
      console.log("success connect!");
      initWebSocket();
    }
  }, [ws]);

  window.addEventListener("resize", () => {
    setHeight(window.innerHeight);
  });

  const initWebSocket = () => {
    ws.on("chat", (data) => {
      console.log(data);
      setChat((preArray) => {
        return [...preArray, data];
      });
    });
  };

  const sendMessage = () => {
    if (name !== "" && message !== "") {
      ws.emit("chat", {name, message});
      setMessage("");
    }
  };

  useEffect(() => {
    console.log(window.location.hostname);
    setWs(
      webSocket(`http://localhost:8282/`, {
        transports: ["websocket"],
      })
    );
    const ramdom = Math.random().toString(36);
    setName("user_" + ramdom.slice(-4));
  }, []);

  useEffect(() => {
    chatBoxref.current.scrollIntoView({behavior: "auto"});
    return () => {};
  }, [chat]);

  const onEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="App">
      <div className="flex h-full bg-black">
        <button
          className={`${popup ? "flex" : "hidden"}`}
          onClick={() => setPopup(false)}
        >
          <svg
            className="a-8 w-8 text-white absolute top-2 right-2"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <line x1="4" y1="12" x2="14" y2="12" />{" "}
            <line x1="4" y1="12" x2="8" y2="16" />{" "}
            <line x1="4" y1="12" x2="8" y2="8" />{" "}
            <line x1="20" y1="4" x2="20" y2="20" />
          </svg>
        </button>
        <div
          className={`bg-gray-900 ${popup ? "hidden" : "grid"} w-full`}
          style={{height: `${height}px`}}
        >
          <div
            className={`bg-gray-800 text-sm flex items-center text-white h-6 w-full`}
          >
            <div className="w-full"></div>
          </div>

          <div
            className="block justify-center items-center overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-800"
            style={{height: `calc(${height}px - 9.5rem)`}}
          >
            {chat.map((data, index) => (
              <div key={index}>
                <div
                  className={`${
                    index % 2 ? "bg-gray-800" : "bg-gray-600"
                  } px-2 py-1 `}
                >
                  <span className=" w-full h-auto text-left text-gray-400 font-semibold text-sm items-end flex ">
                    {data.name} :
                  </span>
                  <span className="w-full h-auto text-left text-gray-100 text-sm font-normal items-end flex ">
                    {data.message}
                  </span>
                </div>
              </div>
            ))}
            <div ref={chatBoxref}></div>
          </div>
          <div className="bg-gray-900 h-32 py-1 w-full">
            <div className="p-0.5">
              <input
                className="text-sm w-full py-1 px-2 border-gray-200 rounded text-gray-700 focus:outline-none"
                type="text"
                placeholder="user"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              ></input>
            </div>
            <div className="p-0.5">
              <textarea
                className="text-sm w-full py-1 px-2 resize-none border-gray-200 rounded text-gray-700 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-800"
                type="text"
                placeholder="message"
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
                onKeyDown={onEnterPress}
                value={message}
              ></textarea>
            </div>
            <div className="mx-0.5">
              <button
                onClick={sendMessage}
                className="text-sm py-1 px-2 w-full  bg-gray-600 text-gray-100 border-gray-200 rounded  focus:outline-none hover:bg-gray-700"
                type="text"
                placeholder="user"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
