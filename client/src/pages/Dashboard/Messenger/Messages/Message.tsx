import React from "react";
import { styled } from "@mui/system";
import Avatar from "../../../../components/Avatar";

function formatTime(date: Date) {
    let h = date.getHours();
    let m: string | number = date.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    m = m < 10 ? "0" + m : m;
    return `${h}:${m} ${ampm}`;
}

const MessageContainer = styled("div")<{ sameAuthor: boolean }>((props) => ({
    display: "flex",
    width: "100%",
    padding: props.sameAuthor ? "2px 24px" : "16px 24px 2px 24px",
    "&:hover": {
        backgroundColor: "rgba(255,255,255,0.02)",
    },
}));

const AvatarSlot = styled("div")({
    width: "40px",
    flexShrink: 0,
    marginRight: "16px",
    display: "flex",
    justifyContent: "center",
});

const ContentArea = styled("div")({
    flex: 1,
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
});

const HeaderRow = styled("div")({
    display: "flex",
    alignItems: "baseline",
    gap: "8px",
    marginBottom: "4px",
});

const AuthorName = styled("span")({
    fontSize: "15px",
    fontWeight: 600,
    color: "#F5F7FB",
});

const TimeStamp = styled("span")({
    fontSize: "12px",
    color: "#7D8795",
});

const MsgText = styled("p")({
    color: "#B8C0CC",
    fontSize: "15px",
    lineHeight: 1.5,
    margin: 0,
    wordBreak: "normal",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
});

interface MessageProps {
    content: string;
    sameAuthor: boolean;
    username: string;
    date: string;
    incomingMessage: boolean;
    isCallMessage?: boolean;
}

const Message = ({ content, sameAuthor, username, date }: MessageProps) => {
    return (
        <MessageContainer sameAuthor={sameAuthor}>
            <AvatarSlot>
                {!sameAuthor && <Avatar username={username} />}
            </AvatarSlot>
            <ContentArea>
                {!sameAuthor && (
                    <HeaderRow>
                        <AuthorName>{username}</AuthorName>
                        <TimeStamp>{formatTime(new Date(date))}</TimeStamp>
                    </HeaderRow>
                )}
                <MsgText>{content}</MsgText>
            </ContentArea>
        </MessageContainer>
    );
};

export default Message;