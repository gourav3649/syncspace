import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import { useAppSelector } from "../../../store";
import { notifyTyping, sendDirectMessage, sendGroupMessage } from "../../../socket/socketConnection";

const InputBar = styled("div")({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 24px 24px 24px",
    background: "#171C26",
    flexShrink: 0,
});

const InputWrapper = styled("div")({
    flex: 1,
    display: "flex",
    alignItems: "center",
    background: "#1D2430",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.04)",
    padding: "4px 8px 4px 16px",
    transition: "all 0.2s ease",
    "&:focus-within": {
        border: "1px solid rgba(91,115,255,0.5)",
        background: "#232B38",
        boxShadow: "0 0 0 3px rgba(91,115,255,0.1)",
    },
});

const Input = styled("input")({
    flex: 1,
    height: "44px",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#F5F7FB",
    fontSize: "15px",
    "&::placeholder": {
        color: "#7D8795",
    },
});

const SendBtn = styled("button")<{ active: boolean }>((props) => ({
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    border: "none",
    cursor: props.active ? "pointer" : "default",
    background: props.active
        ? "#5B73FF"
        : "rgba(255,255,255,0.04)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s ease",
    "&:hover": {
        transform: props.active ? "translateY(-1px)" : "none",
        background: props.active ? "#6b81ff" : "rgba(255,255,255,0.06)",
        boxShadow: props.active ? "0 4px 12px rgba(91,115,255,0.3)" : "none",
    },
}));

const NewMessageInput: React.FC = () => {
    const [message, setMessage] = useState("");
    const [focused, setFocused] = useState(false);
    const { chosenChatDetails, chosenGroupChatDetails } = useAppSelector((state) => state.chat);

    const handleSend = () => {
        if (!message.trim()) return;
        if (chosenChatDetails) {
            sendDirectMessage({ message, receiverUserId: chosenChatDetails.userId! });
        }
        if (chosenGroupChatDetails) {
            sendGroupMessage({ message, groupChatId: chosenGroupChatDetails.groupId });
        }
        setMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSend();
    };

    useEffect(() => {
        if (chosenChatDetails?.userId) {
            notifyTyping({ receiverUserId: chosenChatDetails.userId!, typing: focused });
        }
    }, [focused, chosenChatDetails?.userId]);

    const placeholder = chosenChatDetails
        ? `Message ${chosenChatDetails.username}...`
        : chosenGroupChatDetails
        ? `Message ${chosenGroupChatDetails.groupName}...`
        : "Select a conversation...";

    return (
        <InputBar>
            <InputWrapper>
                <Input
                    placeholder={placeholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    disabled={!chosenChatDetails && !chosenGroupChatDetails}
                />
            </InputWrapper>
            <SendBtn active={!!message.trim()} onClick={handleSend}>
                <SendIcon sx={{ fontSize: 18, color: message.trim() ? "white" : "rgba(255,255,255,0.25)" }} />
            </SendBtn>
        </InputBar>
    );
};

export default NewMessageInput;
