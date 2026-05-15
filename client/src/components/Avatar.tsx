import React from "react";
import { styled } from "@mui/system";

const AVATAR_COLORS = [
    "linear-gradient(135deg, #5865F2, #4752C4)",
    "linear-gradient(135deg, #57F287, #3BA55D)",
    "linear-gradient(135deg, #FEE75C, #E67E22)",
    "linear-gradient(135deg, #EB459E, #AD1457)",
    "linear-gradient(135deg, #ED4245, #C62828)",
    "linear-gradient(135deg, #00B0F4, #0288D1)",
    "linear-gradient(135deg, #FF9500, #E65100)",
];

const getAvatarColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// Use shouldForwardProp to prevent 'large' and 'bg' being forwarded to the DOM element
const AvatarPreview = styled("div", {
    shouldForwardProp: (prop) => prop !== "large" && prop !== "bg",
})<{ bg: string; large?: boolean }>((props) => ({
    height: props.large ? "72px" : "32px",
    width: props.large ? "72px" : "32px",
    background: props.bg,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: props.large ? "28px" : "12px",
    fontWeight: 700,
    color: "white",
    flexShrink: 0,
    letterSpacing: "0.5px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    textTransform: "uppercase" as const,
}));

const Avatar = ({ username, large }: { username: string; large?: boolean }) => {
    const color = getAvatarColor(username || "?");
    const initials = (username || "?").substring(0, 2);
    return (
        <AvatarPreview bg={color} large={large}>
            {initials}
        </AvatarPreview>
    );
};

export default Avatar;
