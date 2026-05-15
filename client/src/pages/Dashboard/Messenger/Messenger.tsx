import React from "react";
import { styled, keyframes } from "@mui/system";
import { useAppSelector } from "../../../store";
import WelcomeMessage from "./WelcomeMessage";
import ChatDetails from "./ChatDetails";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const MainContainer = styled("div")({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#313338",
    overflow: "hidden",
    animation: `${fadeIn} 0.2s ease`,
});

const Messenger = () => {
    const { chosenChatDetails, chosenGroupChatDetails } = useAppSelector((state) => state.chat);

    return (
        <MainContainer>
            {chosenChatDetails?.userId || chosenGroupChatDetails?.groupId
                ? <ChatDetails />
                : <WelcomeMessage />}
        </MainContainer>
    );
};

export default Messenger;
