import React, { useState, useEffect, useRef } from "react";
import { styled } from "@mui/system";
import MessagesHeader from "./Header";
import Message from "./Message";
import { useAppSelector } from "../../../../store";
import { fetchDirectChatHistory, fetchGroupChatHistory } from "../../../../socket/socketConnection";
import { Message as MessageType } from "../../../../actions/types";
import DateSeparator from "./DateSeparator";

const Container = styled("div")({
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
    background: "#171C26",
});

const ScrollArea = styled("div")({
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    padding: "8px 0",
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(255,255,255,0.1) transparent",
    "&::-webkit-scrollbar": {
        width: "6px",
    },
    "&::-webkit-scrollbar-track": {
        background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
        background: "rgba(255,255,255,0.1)",
        borderRadius: "3px",
    },
});

const ConversationStart = styled("div")({
    padding: "24px 16px 8px 16px",
    color: "rgba(255,255,255,0.35)",
    fontSize: "13px",
    textAlign: "center",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    marginBottom: "8px",
});

const Messages = () => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const { chat, auth: { userDetails } } = useAppSelector((state) => state);
    const { chosenChatDetails, messages, chosenGroupChatDetails } = chat;

    const sameAuthor = (message: MessageType, index: number) => {
        if (index === 0) return false;
        return message.author._id === messages[index - 1].author._id;
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        setScrollPosition(e.currentTarget.scrollTop);
    };

    useEffect(() => {
        if (chosenChatDetails) {
            fetchDirectChatHistory({ receiverUserId: chosenChatDetails.userId });
        }
        if (chosenGroupChatDetails) {
            fetchGroupChatHistory({ groupChatId: chosenGroupChatDetails.groupId });
        }
    }, [chosenChatDetails, chosenGroupChatDetails]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <Container>
            <MessagesHeader scrollPosition={scrollPosition} />
            <ScrollArea onScroll={handleScroll}>
                <ConversationStart>
                    {chosenChatDetails?.userId
                        ? `✨ Start of your conversation with ${chosenChatDetails?.username}`
                        : `✨ Start of the group conversation`}
                </ConversationStart>

                {messages.map((message, index) => {
                    const thisDate = new Date(message.createdAt).toDateString();
                    const prevDate = index > 0 ? new Date(messages[index - 1]?.createdAt).toDateString() : null;
                    const isSameDay = index > 0 ? thisDate === prevDate : true;
                    const incomingMessage = message.author._id !== (userDetails as any)._id;

                    return (
                        <div key={message._id}>
                            {(!isSameDay || index === 0) && (
                                <DateSeparator date={message.createdAt} />
                            )}
                            <Message
                                content={message.content}
                                username={message.author.username}
                                sameAuthor={sameAuthor(message, index)}
                                date={message.createdAt}
                                incomingMessage={incomingMessage}
                            />
                        </div>
                    );
                })}
                <div ref={messagesEndRef} style={{ height: "8px" }} />
            </ScrollArea>
        </Container>
    );
};

export default Messages;
