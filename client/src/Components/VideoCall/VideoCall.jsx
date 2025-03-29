import React, { memo, useContext } from "react";
import "./videocall.scss";
import { ChatContext } from "../../Chat_Context";
import { MdCallEnd } from "react-icons/md";

function VideoCall() {
  const { localStream, remoteStream, callStarted, rejectCall } = useContext(ChatContext);

  return (
    <section className={`video-call ${callStarted ? "active" : null}`}>
      <video autoPlay className="remote-stream" ref={remoteStream}></video>

      <div className="end-call" onClick={() => rejectCall()}>
        <MdCallEnd className="end-call-icon" size={30} />
      </div>

      <video autoPlay className="local-stream" muted ref={localStream}></video>
    </section>
  );
}

export default memo(VideoCall);
