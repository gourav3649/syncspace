import React from "react";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Container = styled("div")({
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#0F1115", 
    color: "#F5F7FB",
    overflowX: "hidden",
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
});

const GridOverlay = styled("div")({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px",
    maskImage: "radial-gradient(circle at top, black 0%, transparent 60%)",
    WebkitMaskImage: "radial-gradient(circle at top, black 0%, transparent 60%)",
    pointerEvents: "none",
    zIndex: 0,
});

const Nav = styled("nav")({
    width: "100%",
    padding: "24px 48px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10,
    position: "relative",
    boxSizing: "border-box",
    "@media (max-width: 768px)": { padding: "20px 24px" },
});

const LogoText = styled("div")({
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    gap: "10px",
});

const NavActions = styled("div")({ display: "flex", gap: "16px" });

const NavBtnGhost = styled("button")({
    background: "transparent",
    color: "#B8C0CC",
    border: "none",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    padding: "8px 16px",
    borderRadius: "8px",
    transition: "color 0.2s",
    "&:hover": { color: "#FFFFFF" },
});

const NavBtnPrimary = styled("button")({
    background: "#5B73FF",
    color: "#FFFFFF",
    border: "none",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    padding: "8px 20px",
    borderRadius: "8px",
    transition: "background 0.2s",
    "&:hover": { background: "#4A62EE" },
});

const HeroSection = styled("section")({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "120px 20px 80px",
    position: "relative",
    zIndex: 1,
});

const Title = styled(motion.h1)({
    fontSize: "clamp(48px, 6vw, 72px)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-0.04em",
    marginBottom: "24px",
    maxWidth: "900px",
    "& span": { color: "#5B73FF" },
});

const Subtitle = styled(motion.p)({
    fontSize: "clamp(18px, 2vw, 22px)",
    color: "#B8C0CC",
    maxWidth: "600px",
    lineHeight: 1.5,
    marginBottom: "48px",
    fontWeight: 400,
});

const PrimaryButtonLg = styled(motion.button)({
    background: "#5B73FF",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "12px",
    padding: "18px 40px",
    fontSize: "18px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
    "&:hover": { background: "#4A62EE" },
});

const TrustStrip = styled("div")({
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    padding: "40px 20px",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    flexWrap: "wrap",
    color: "#7D8795",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: "80px",
    "& span": { display: "flex", alignItems: "center", gap: "8px" }
});

const Section = styled("section")<{ reverse?: boolean }>((props) => ({
    display: "flex",
    alignItems: "center",
    flexDirection: props.reverse ? "row-reverse" : "row",
    gap: "60px",
    padding: "80px 10vw",
    maxWidth: "1400px",
    margin: "0 auto",
    "@media (max-width: 900px)": {
        flexDirection: "column",
        textAlign: "center",
        padding: "60px 5vw",
        gap: "40px",
    },
}));

const SectionText = styled("div")({
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "20px",
});

const SectionKicker = styled("div")({
    color: "#5B73FF",
    fontWeight: 600,
    fontSize: "14px",
    letterSpacing: "1px",
    textTransform: "uppercase",
});

const SectionHeading = styled("h2")({
    fontSize: "clamp(32px, 4vw, 48px)",
    fontWeight: 700,
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
    margin: 0,
});

const SectionBody = styled("p")({
    fontSize: "18px",
    color: "#B8C0CC",
    lineHeight: 1.6,
    margin: 0,
});

const VisualPlaceholder = styled("div")({
    flex: 1,
    width: "100%",
    aspectRatio: "4/3",
    backgroundColor: "#171C26",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#7D8795",
    fontSize: "14px",
});

const FinalCTA = styled("section")({
    textAlign: "center",
    padding: "120px 20px",
    backgroundColor: "#131720",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    marginTop: "80px",
});


const LandingPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Container>
            <GridOverlay />
            
            <Nav>
                <LogoText>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#5B73FF"/>
                        <path d="M2 17L12 22L22 17" stroke="#5B73FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="#5B73FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    SyncSpace
                </LogoText>
                <NavActions>
                    <NavBtnGhost onClick={() => navigate("/login")}>Login</NavBtnGhost>
                    <NavBtnPrimary onClick={() => navigate("/register")}>Sign Up</NavBtnPrimary>
                </NavActions>
            </Nav>

            <HeroSection>
                <Title
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    A place to <span>sync</span> and collaborate.
                </Title>
                <Subtitle
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    Everything your team needs to stay in sync — fast chat, focused groups, and real-time calls. Built for modern workspaces.
                </Subtitle>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <PrimaryButtonLg 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate("/register")}
                    >
                        Open SyncSpace in your browser
                    </PrimaryButtonLg>
                </motion.div>
            </HeroSection>

            <TrustStrip>
                <span>✓ Browser-based</span>
                <span>✓ WebRTC Powered</span>
                <span>✓ Real-time Messaging</span>
                <span>✓ Secure Spaces</span>
            </TrustStrip>

            <Section>
                <SectionText>
                    <SectionKicker>Instant Communication</SectionKicker>
                    <SectionHeading>Real-time messaging built for speed.</SectionHeading>
                    <SectionBody>
                        Ditch the clunky, slow chat apps. SyncSpace delivers instant, reliable text messaging with rich media support, allowing your team to exchange ideas without missing a beat.
                    </SectionBody>
                </SectionText>
                <VisualPlaceholder>[ Messaging Interface Visual ]</VisualPlaceholder>
            </Section>

            <Section reverse>
                <SectionText>
                    <SectionKicker>Seamless Calls</SectionKicker>
                    <SectionHeading>High-quality video and screen sharing.</SectionHeading>
                    <SectionBody>
                        Jump from text to face-to-face instantly. Host reliable video meetings and share your screen in real-time, all powered by secure WebRTC architecture.
                    </SectionBody>
                </SectionText>
                <VisualPlaceholder>[ Video Call Visual ]</VisualPlaceholder>
            </Section>

            <Section>
                <SectionText>
                    <SectionKicker>Focused Workspaces</SectionKicker>
                    <SectionHeading>Groups and collaboration spaces.</SectionHeading>
                    <SectionBody>
                        Organize your community with dedicated rooms and groups. Keep conversations focused, invite the right people, and maintain clear separation between different projects.
                    </SectionBody>
                </SectionText>
                <VisualPlaceholder>[ Group Management Visual ]</VisualPlaceholder>
            </Section>

            <FinalCTA>
                <SectionHeading style={{ marginBottom: "20px" }}>Ready to bring your team together?</SectionHeading>
                <SectionBody style={{ marginBottom: "40px" }}>Join SyncSpace today and transform how you collaborate.</SectionBody>
                <PrimaryButtonLg 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/register")}
                >
                    Get Started Now
                </PrimaryButtonLg>
            </FinalCTA>
        </Container>
    );
};

export default LandingPage;
