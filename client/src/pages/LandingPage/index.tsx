import React from "react";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Container = styled("div")({
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#0F1115",
    color: "#FFFFFF",
    overflow: "hidden",
    position: "relative",
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
});

const BackgroundBlob = styled(motion.div)({
    position: "absolute",
    width: "60vw",
    height: "60vw",
    borderRadius: "50%",
    filter: "blur(100px)",
    opacity: 0.15,
    zIndex: 0,
});

const Blob1 = styled(BackgroundBlob)({
    top: "-10%",
    left: "-10%",
    background: "linear-gradient(135deg, #5865F2, #8E2DE2)",
});

const Blob2 = styled(BackgroundBlob)({
    bottom: "-20%",
    right: "-10%",
    background: "linear-gradient(135deg, #00C9FF, #92FE9D)",
});

const ContentWrapper = styled("div")({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1,
    textAlign: "center",
});

const Nav = styled("nav")({
    width: "100%",
    padding: "24px 48px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
    boxSizing: "border-box",
    "@media (max-width: 768px)": {
        padding: "20px 24px",
    },
});

const LogoText = styled("div")({
    fontSize: "24px",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    background: "linear-gradient(90deg, #FFFFFF, #B9BCC3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    display: "flex",
    alignItems: "center",
    gap: "10px",
});

const NavActions = styled("div")({
    display: "flex",
    gap: "16px",
});

const NavLoginBtn = styled("button")({
    background: "transparent",
    color: "#FFFFFF",
    border: "none",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "background 0.2s",
    "&:hover": {
        background: "rgba(255, 255, 255, 0.05)",
    },
});

const Title = styled(motion.h1)({
    fontSize: "clamp(40px, 8vw, 80px)",
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    marginBottom: "24px",
    maxWidth: "800px",
    "& span": {
        background: "linear-gradient(135deg, #5865F2 0%, #4752C4 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
});

const Subtitle = styled(motion.p)({
    fontSize: "clamp(16px, 2vw, 20px)",
    color: "#949BA4",
    maxWidth: "600px",
    lineHeight: 1.6,
    marginBottom: "48px",
});

const ActionButtonGroup = styled(motion.div)({
    display: "flex",
    gap: "20px",
    "@media (max-width: 600px)": {
        flexDirection: "column",
        width: "100%",
        maxWidth: "300px",
    },
});

const PrimaryButton = styled(motion.button)({
    background: "linear-gradient(135deg, #5865F2 0%, #4752C4 100%)",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    padding: "16px 32px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(88, 101, 242, 0.3)",
    transition: "box-shadow 0.2s",
    "&:hover": {
        boxShadow: "0 12px 32px rgba(88, 101, 242, 0.4)",
    },
});

const SecondaryButton = styled(motion.button)({
    background: "rgba(255, 255, 255, 0.05)",
    color: "#FFFFFF",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "16px 32px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    backdropFilter: "blur(10px)",
});


const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <Blob1 
                animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.15, 0.2, 0.15],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <Blob2 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.15, 0.1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />

            <Nav>
                <LogoText>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#5865F2"/>
                        <path d="M2 17L12 22L22 17" stroke="#5865F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="#5865F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    SyncSpace
                </LogoText>
                <NavActions>
                    <NavLoginBtn onClick={() => navigate("/login")}>Log In</NavLoginBtn>
                </NavActions>
            </Nav>

            <ContentWrapper>
                <Title
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Connect effortlessly. <br />
                    <span>Collaborate anywhere.</span>
                </Title>
                
                <Subtitle
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                    Experience seamless video calls, instant messaging, and real-time collaboration 
                    designed for modern teams and communities.
                </Subtitle>

                <ActionButtonGroup
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                >
                    <PrimaryButton 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/register")}
                    >
                        Get Started for Free
                    </PrimaryButton>
                    
                    <SecondaryButton
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/login")}
                    >
                        Sign In
                    </SecondaryButton>
                </ActionButtonGroup>
            </ContentWrapper>
        </Container>
    );
};

export default LandingPage;
