import React, { useState, useEffect } from "react";
import { styled } from "@mui/system";
import SendIcon from "@mui/icons-material/Send";
import { useAppSelector } from "../../../store";
import { notifyTyping, sendDirectMessage, sendGroupMessage } from "../../../socket/socketConnection";

const InputBar = styled("div")({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    background: "#313338",
    borderTop: "1px solid rgba(255,255,255,0.06)",
    flexShrink: 0,
});

const InputWrapper = styled("div")({
    flex: 1,
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.07)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "0 14px",
    transition: "all 0.2s ease",
    "&:focus-within": {
        border: "1px solid rgba(88,101,242,0.5)",
        background: "rgba(255,255,255,0.09)",
        boxShadow: "0 0 0 3px rgba(88,101,242,0.1)",
    },
});

const Input = styled("input")({
    flex: 1,
    height: "44px",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#ffffff",
    fontSize: "15px",
    "&::placeholder": {
        color: "rgba(255,255,255,0.3)",
    },
});

const SendBtn = styled("button")<{ active: boolean }>((props) => ({
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    border: "none",
    cursor: props.active ? "pointer" : "default",
    background: props.active
        ? "linear-gradient(135deg, #5865F2 0%, #4752C4 100%)"
        : "rgba(255,255,255,0.06)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.2s ease",
    boxShadow: props.active ? "0 4px 12px rgba(88,101,242,0.35)" : "none",
    "&:hover": {
        transform: props.active ? "scale(1.05)" : "none",
        boxShadow: props.active ? "0 6px 16px rgba(88,101,242,0.45)" : "none",
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
