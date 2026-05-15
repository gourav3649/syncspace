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

/**
 * Layout: 3-column grid
 *   [40% receiver] [20% gap] [40% sender]
 *
 * Receiver messages sit in the LEFT column, right-aligned within it.
 * Sender messages sit in the RIGHT column, left-aligned within it.
 * The middle 20% is always empty — creates the WhatsApp-style split.
 */
const Row = styled("div")<{ incoming: boolean }>((props) => ({
    display: "grid",
    gridTemplateColumns: "40% 20% 40%",
    width: "100%",
    padding: "1px 12px",
    boxSizing: "border-box",
    // The bubble lives in col 1 (incoming) or col 3 (outgoing)
    "& > .bubble-wrap": {
        gridColumn: props.incoming ? "1" : "3",
        display: "flex",
        flexDirection: "column",
        alignItems: props.incoming ? "flex-start" : "flex-end",
    },
}));

const BubbleRow = styled("div")<{ incoming: boolean }>((props) => ({
    display: "flex",
    flexDirection: (props.incoming ? "row" : "row-reverse") as "row" | "row-reverse",
    alignItems: "flex-end",
    gap: "8px",
}));

const AvatarSlot = styled("div")({
    width: "28px",
    flexShrink: 0,
});

const Bubble = styled("div")<{ incoming: boolean; sameAuthor: boolean }>((props) => ({
    /* Bubble grows with content but won't push past its column */
    display: "inline-block",
    maxWidth: "100%",        // constrained by the grid column (40%)
    padding: "8px 12px",
    borderRadius: props.incoming
        ? props.sameAuthor ? "12px 12px 12px 4px" : "4px 12px 12px 12px"
        : props.sameAuthor ? "12px 12px 4px 12px" : "12px 4px 12px 12px",

    /* Sender: solid blue, NO glow/shadow */
    background: props.incoming ? "rgba(255,255,255,0.08)" : "#5865F2",
    border: props.incoming ? "1px solid rgba(255,255,255,0.06)" : "none",

    /* Word-wrap: never break a word mid-character; wrap the whole word to next line */
    wordBreak: "normal",
    overflowWrap: "break-word",   // only break if a single token exceeds the full width
    whiteSpace: "pre-wrap",
}));

const MsgText = styled("p")({
    color: "rgba(255,255,255,0.93)",
    fontSize: "14px",
    lineHeight: 1.55,
    margin: 0,
});

const AuthorLabel = styled("span")({
    fontSize: "11px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.4)",
    marginBottom: "3px",
    display: "block",
    paddingLeft: "2px",
});

const TimestampRow = styled("div")<{ incoming: boolean }>((props) => ({
    fontSize: "10px",
    color: "rgba(255,255,255,0.3)",
    marginTop: "3px",
    paddingLeft: props.incoming ? "2px" : "0",
    paddingRight: props.incoming ? "0" : "2px",
    textAlign: props.incoming ? "left" : "right",
}));

interface MessageProps {
    content: string;
    sameAuthor: boolean;
    username: string;
    date: string;
    incomingMessage: boolean;
    isCallMessage?: boolean;
}

const Message = ({ content, sameAuthor, username, date, incomingMessage, isCallMessage }: MessageProps) => {
    return (
        <Row incoming={incomingMessage} style={{ marginTop: sameAuthor ? "2px" : "10px" }}>
            <div className="bubble-wrap">
                {incomingMessage && !sameAuthor && (
                    <AuthorLabel>{username}</AuthorLabel>
                )}
                <BubbleRow incoming={incomingMessage}>
                    {incomingMessage && (
                        <AvatarSlot>
                            {!sameAuthor ? <Avatar username={username} /> : null}
                        </AvatarSlot>
                    )}
                    <Bubble incoming={incomingMessage} sameAuthor={sameAuthor}>
                        <MsgText>{content}</MsgText>
                    </Bubble>
                </BubbleRow>
                <TimestampRow incoming={incomingMessage}>
                    {formatTime(new Date(date))}
                </TimestampRow>
            </div>
        </Row>
    );
};

export default Message;