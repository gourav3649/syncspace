import React from "react";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Container = styled("div")({
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#111214", // Deeper, more authentic dark
    color: "#F2F3F5",
    overflow: "hidden",
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
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
    position: "relative",
});

const GridOverlay = styled("div")({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px",
    maskImage: "radial-gradient(circle at center, black 0%, transparent 80%)",
    WebkitMaskImage: "radial-gradient(circle at center, black 0%, transparent 80%)",
    pointerEvents: "none",
    zIndex: -1,
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
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "-0.5px",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    gap: "10px",
});

const NavActions = styled("div")({
    display: "flex",
    gap: "16px",
});

const NavLoginBtn = styled("button")({
    background: "#FFFFFF",
    color: "#111214",
    border: "none",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "20px",
    transition: "background 0.2s, color 0.2s",
    "&:hover": {
        background: "#F2F3F5",
        color: "#000000",
    },
});

const Title = styled(motion.h1)({
    fontSize: "clamp(36px, 6vw, 64px)",
    fontWeight: 900,
    lineHeight: 1.1,
    letterSpacing: "-0.04em",
    marginBottom: "24px",
    maxWidth: "800px",
    color: "#FFFFFF",
    "& span": {
        color: "#5865F2", // Core accent color
    },
});

const Subtitle = styled(motion.p)({
    fontSize: "clamp(16px, 2vw, 20px)",
    color: "#B5BAC1",
    maxWidth: "600px",
    lineHeight: 1.6,
    marginBottom: "40px",
    fontWeight: 400,
});

const ActionButtonGroup = styled(motion.div)({
    display: "flex",
    gap: "16px",
    "@media (max-width: 600px)": {
        flexDirection: "column",
        width: "100%",
        maxWidth: "300px",
    },
});

const PrimaryButton = styled(motion.button)({
    background: "#5865F2",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "28px",
    padding: "16px 32px",
    fontSize: "18px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    "&:hover": {
        background: "#4752C4",
    },
});


const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container>
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
                    <NavLoginBtn onClick={() => navigate("/login")}>Login</NavLoginBtn>
                </NavActions>
            </Nav>

            <ContentWrapper>
                <GridOverlay />
                
                <Title
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    A place to <span>sync</span> and collaborate.
                </Title>
                
                <Subtitle
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                >
                    High-quality video calls, instant messaging, and seamless collaboration. 
                    Built for teams and communities that demand more from their workspace.
                </Subtitle>

                <ActionButtonGroup
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                >
                    <PrimaryButton 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/register")}
                    >
                        Open SyncSpace in your browser
                    </PrimaryButton>
                </ActionButtonGroup>
            </ContentWrapper>
        </Container>
    );
};

export default LandingPage;
