import React from "react";
import { styled } from "@mui/system";
import Messages from "./Messages";
import NewMessageInput from "./NewMessageInput";
import Typing from "./Typing";

const Wrapper = styled("div")({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    height: "100%",
});

const ChatDetails = () => {
    return (
        <Wrapper>
            <Messages />
            <Typing />
            <NewMessageInput />
        </Wrapper>
    );
};

export default ChatDetails;
