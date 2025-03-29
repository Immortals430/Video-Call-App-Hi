import { useEffect, useState } from "react";
import Header from "./Components/Header/Header";
import UserList from "./Components/UserList/UserList";
import UserData from "./Components/UserData/UserData";
import ChatContextProvider from "./Chat_Context";
import VideoCall from "./Components/VideoCall/VideoCall";
import IncomingCall from "./Components/IncomingCall/incomingCall";

function App() {
  const [modalShow, setModalShow] = useState(true);
  const [incomingCallState, setIncomingCallState] = useState(false);
  const [callStarted, setCallStarted] = useState(false);


  return (
    <>
      <ChatContextProvider
        setIncomingCallState={setIncomingCallState}
        callStarted={callStarted}
        setCallStarted={setCallStarted}
      >
        <Header />
        <UserList />

        <UserData show={modalShow} onHide={() => setModalShow(false)} />

        {incomingCallState && (
          <IncomingCall
            show={incomingCallState}
            onHide={() => setIncomingCallState(false)}
          />
        )}

        <VideoCall />
      </ChatContextProvider>
    </>
  );
}

export default App;
