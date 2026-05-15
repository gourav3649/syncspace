import React from "react";
import { styled, keyframes } from "@mui/system";

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const BoxWrapper = styled("div")({
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    backgroundSize: "400% 400%",
    animation: `${gradientShift} 12s ease infinite`,
    position: "relative",
    overflow: "hidden",
    "&::before": {
        content: '""',
        position: "absolute",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(88,101,242,0.15) 0%, transparent 70%)",
        top: "-200px",
        left: "-200px",
    },
    "&::after": {
        content: '""',
        position: "absolute",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(87,242,135,0.08) 0%, transparent 70%)",
        bottom: "-150px",
        right: "-100px",
    },
});

const GlassCard = styled("div")({
    maxWidth: 440,
    width: "90%",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "24px",
    padding: "48px 40px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
    position: "relative",
    zIndex: 1,
    animation: `${float} 6s ease-in-out infinite`,
    "@media (max-width: 500px)": {
        padding: "36px 24px",
    },
});

const Logo = styled("div")({
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #5865F2 0%, #57F287 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
    boxShadow: "0 8px 24px rgba(88,101,242,0.4)",
    fontSize: "28px",
});

const AuthBox: React.FC = (props) => {
    return (
        <BoxWrapper>
            <GlassCard>
                <Logo>💬</Logo>
                {props.children}
            </GlassCard>
        </BoxWrapper>
    );
};

export default AuthBox;
