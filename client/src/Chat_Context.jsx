import { createContext, useEffect, useRef, useState } from "react";
import socket from "./config/socket";
import ringtone from "./assets/incomingcallring.wav";

// Create the context with a default value
export const ChatContext = createContext();

export default function ChatContextProvider({
  children,
  incomingCallState,
  setIncomingCallState,
  callStarted,
  setCallStarted,
}) {
  const [loggedUser, setLoggedUser] = useState();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const localStream = useRef();
  const remoteStream = useRef();
  const peerReference = useRef(null);
  const [callerId, setCallerId] = useState();
  const [incomingOffer, setIncomingOffer] = useState();
  const ring = useRef(new Audio(ringtone));

  // stream local video
  const streamLocalVideo = async () => {
    const video = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    localStream.current.srcObject = video;
    return video;
  };

  // add track
  const addTrack = async (video, peer) => {
    video.getTracks().forEach((track) => {
      peer.addTrack(track, video);
    });
  };

  // create peer
  const createPeer = () => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerReference.current = peer;
    return peer;
  };

  // createOffer
  const createOffer = async (peer) => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  // createAnswer
  const createAnswer = async (peer, offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  // handle incoming answer
  const handleIncomingAnswer = async (answer) => {
    await peerReference.current.setRemoteDescription(answer);
  };

  // handle incoming track
  const handleTrack = async (e) => {
    remoteStream.current.srcObject = e.streams[0];
  };

  // emit ice candidate
  const emitIceCandidate = (e, outGoingUCallserId) => {
    if (e.candidate) {
      socket.emit("icecandidate", {
        outGoingUCallserId,
        candidate: e.candidate,
      });
    }
  };

  // add ice candidate
  const handleIceCandidate = async (candidate) => {
    if (peerReference.current) {
      await peerReference.current.addIceCandidate(candidate);
    }
  };

  // end call
  const endCall = () => {
    console.log(callerId);
    peerReference.current.close();
    ring.current.pause();
    setCallerId("");
    setIncomingOffer("");
    setIncomingCallState(false);
    localStream.current.srcObject.getTracks().forEach((track) => track.stop());
    setCallStarted(false);
  };

  // handle end call
  const handleEndCall = (userId) => {
    if (callerId == userId) {
      endCall();
    }
  };

  useEffect(() => {
    if (loggedUser)
      socket.emit("connected", {
        myUserId: loggedUser.myUserId,
        username: loggedUser.myUsername,
        avatar: loggedUser.avatar,
      });

    socket.on("offer", ({ callerId, offer }) => {
      setIncomingCallState(true);
      setIncomingOffer(offer);
      setCallerId(callerId);
    });

    socket.on("answer", ({ answer }) => handleIncomingAnswer(answer));
    socket.on("icecandidate", ({ candidate }) => handleIceCandidate(candidate));

    socket.on("online-users", (data) => setOnlineUsers(data));
    socket.on("new-user", (data) => {
      setOnlineUsers((prev) => [...prev, data]);
    });

    return () => {
      socket.off("online-users");
      socket.off("new-user");
      socket.off("offer");
      socket.off("answer");
      socket.off("icecandidate");
    };
  }, [loggedUser]);

  useEffect(() => {
    socket.on("end-call", ({ userId }) => handleEndCall(userId));
    return () => {
      socket.off("end-call");
    };
  }, [callerId]);

  // call user
  const callUser = async (myUserId, outGoingUCallserId) => {
    setCallStarted(true);
    setCallerId(outGoingUCallserId);
    const video = await streamLocalVideo();
    const peer = createPeer();
    peer.ontrack = handleTrack;
    peer.onicecandidate = (e) => emitIceCandidate(e, outGoingUCallserId);
    await addTrack(video, peer);
    const offer = await createOffer(peer);
    socket.emit("offer", {
      callerId: myUserId,
      userToCallId: outGoingUCallserId,
      offer,
    });
  };

  // answer call
  const answerCall = async (callerId) => {
    ring.current.pause();
    setIncomingCallState(false);
    setCallStarted(true);
    const video = await streamLocalVideo();
    const peer = createPeer();
    peer.ontrack = handleTrack;
    peer.onicecandidate = (e) => emitIceCandidate(e, callerId);
    await addTrack(video, peer);
    const answer = await createAnswer(peer, incomingOffer);
    socket.emit("answer", { callerId, answer });
  };

  // reject call
  const rejectCall = () => {
    endCall();
    socket.emit("end-call", {
      userId: loggedUser.myUserId,
      senderId: callerId,
    });
  };

  const value = {
    localStream,
    remoteStream,
    loggedUser,
    setLoggedUser,
    onlineUsers,
    setOnlineUsers,
    callUser,
    incomingCallState,
    setIncomingCallState,
    callStarted,
    answerCall,
    callerId,
    ring,
    rejectCall,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
