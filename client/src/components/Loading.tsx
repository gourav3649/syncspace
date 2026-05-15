import React from "react";
import { styled, keyframes } from "@mui/system";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const Wrapper = styled("div")({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100vh",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    gap: "20px",
});

const Spinner = styled("div")({
    width: "44px",
    height: "44px",
    border: "3px solid rgba(88,101,242,0.2)",
    borderTop: "3px solid #5865F2",
    borderRadius: "50%",
    animation: `${spin} 0.8s linear infinite`,
});

const Label = styled("p")({
    color: "rgba(255,255,255,0.4)",
    fontSize: "14px",
    fontWeight: 500,
    margin: 0,
    animation: `${pulse} 1.5s ease-in-out infinite`,
});

export default function Loading() {
    return (
        <Wrapper>
            <Spinner />
            <Label>Loading SyncSpace...</Label>
        </Wrapper>
    );
}