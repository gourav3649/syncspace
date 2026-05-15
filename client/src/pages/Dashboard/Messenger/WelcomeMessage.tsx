import React from "react";
import { styled, keyframes } from "@mui/system";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.97); }
`;

const Wrapper = styled("div")({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    textAlign: "center",
    background: "#313338",
    gap: "16px",
});

const IconRing = styled("div")({
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    background: "rgba(88,101,242,0.12)",
    border: "2px solid rgba(88,101,242,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "42px",
    animation: `${float} 4s ease-in-out infinite`,
});

const Title = styled("h2")({
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.3px",
});

const Subtitle = styled("p")({
    color: "rgba(255,255,255,0.4)",
    fontSize: "15px",
    maxWidth: "320px",
    margin: 0,
    lineHeight: 1.6,
});

const Hint = styled("div")({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(88,101,242,0.1)",
    border: "1px solid rgba(88,101,242,0.2)",
    borderRadius: "10px",
    padding: "10px 16px",
    marginTop: "8px",
});

const HintText = styled("span")({
    color: "rgba(255,255,255,0.5)",
    fontSize: "13px",
});

const WelcomeMessage = () => {
    return (
        <Wrapper>
            <IconRing>💬</IconRing>
            <Title>No conversation selected</Title>
            <Subtitle>
                Pick a friend from the sidebar to start chatting, or invite someone new!
            </Subtitle>
            <Hint>
                <span>👈</span>
                <HintText>Select a friend or group from the left panel</HintText>
            </Hint>
        </Wrapper>
    );
};

export default WelcomeMessage;