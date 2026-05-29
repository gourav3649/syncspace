import React from "react";
import { styled, keyframes } from "@mui/system";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled("div")({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "#171C26",
    height: "100%",
});

const Card = styled("div")({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px",
    background: "#1D2430",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.04)",
    boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
    textAlign: "center",
    maxWidth: "400px",
    animation: `${fadeIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1)`,
});

const IconCircle = styled("div")({
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "rgba(91,115,255,0.1)",
    color: "#5B73FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
});

const Title = styled("h2")({
    color: "#F5F7FB",
    fontSize: "20px",
    fontWeight: 700,
    margin: "0 0 12px 0",
    letterSpacing: "-0.01em",
});

const Subtitle = styled("p")({
    color: "#B8C0CC",
    fontSize: "15px",
    margin: "0 0 32px 0",
    lineHeight: 1.5,
});

const ActionRow = styled("div")({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
});

const PrimaryHint = styled("div")({
    flex: 1,
    background: "#5B73FF",
    color: "#ffffff",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "background 0.2s",
});

const WelcomeMessage = () => {
    return (
        <Wrapper>
            <Card>
                <IconCircle>
                    <ChatBubbleOutlineIcon sx={{ fontSize: 32 }} />
                </IconCircle>
                <Title>Your Workspace</Title>
                <Subtitle>
                    Select a conversation from the sidebar, or create a new group to start collaborating.
                </Subtitle>
                <ActionRow>
                    <PrimaryHint>
                        Select a conversation
                    </PrimaryHint>
                </ActionRow>
            </Card>
        </Wrapper>
    );
};

export default WelcomeMessage;