import React from "react";
import { styled, keyframes } from "@mui/system";
import Backdrop from "@mui/material/Backdrop";
import IconButton from "@mui/material/IconButton";
import CallIcon from "@mui/icons-material/Call";
import CallEndIcon from "@mui/icons-material/CallEnd";
import VideocamIcon from "@mui/icons-material/Videocam";
import { useAppSelector } from "../store";
import { callResponse } from "../socket/socketConnection";
import Avatar from "./Avatar";

/* ── animations ─────────────────────────────────────────────── */

const ripple = keyframes`
  0%   { transform: scale(1);   opacity: 0.6; }
  100% { transform: scale(1.7); opacity: 0;   }
`;

const ring = keyframes`
  0%         { transform: rotate(0deg);  }
  10%        { transform: rotate(-10deg); }
  20%        { transform: rotate(10deg);  }
  30%        { transform: rotate(-7deg);  }
  40%        { transform: rotate(7deg);   }
  50%, 100%  { transform: rotate(0deg);  }
`;

/* ── card ────────────────────────────────────────────────────── */

const Card = styled("div")({
    background: "#1e1f22",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "24px",
    padding: "36px 44px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
    minWidth: "300px",
});

/* ── avatar area with two ripple circles ─────────────────────── */

const AvatarArea = styled("div")({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "96px",
    height: "96px",
    marginBottom: "4px",
});

const Ripple = styled("div")<{ delay: string }>((props) => ({
    position: "absolute",
    inset: 0,
    borderRadius: "50%",                          // ← always a circle
    border: "2px solid rgba(87,242,135,0.5)",
    animation: `${ripple} 2s ease-out ${props.delay} infinite`,
}));

/* ── call type pill ──────────────────────────────────────────── */

const CallTypePill = styled("div")({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "20px",
    padding: "5px 14px",
    fontSize: "12px",
    color: "rgba(255,255,255,0.55)",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.6px",
});

const AnimatedIcon = styled("div")({
    animation: `${ring} 1.8s ease-in-out infinite`,
    display: "flex",
    lineHeight: 0,
});

/* ── caller info — stacked cleanly, no overlap ───────────────── */

const CallerInfo = styled("div")({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",                                   // ← proper gap, not negative margin
});

const CallerName = styled("p")({
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "22px",
    letterSpacing: "-0.3px",
    textAlign: "center",
    margin: 0,
});

const CallerSubtitle = styled("p")({
    color: "rgba(255,255,255,0.4)",
    fontSize: "14px",
    textAlign: "center",
    margin: 0,
});

/* ── buttons ─────────────────────────────────────────────────── */

const ButtonsRow = styled("div")({
    display: "flex",
    alignItems: "center",
    gap: "28px",
    marginTop: "12px",
});

const CallBtn = styled(IconButton)<{ btnvariant: "accept" | "reject" | "video" }>((props) => ({
    width: "62px",
    height: "62px",
    borderRadius: "50%",
    background:
        props.btnvariant === "accept"
            ? "linear-gradient(135deg, #57F287, #3BA55D)"
            : props.btnvariant === "video"
            ? "linear-gradient(135deg, #5865F2, #4752C4)"
            : "linear-gradient(135deg, #ED4245, #C62828)",
    color: "#ffffff",
    transition: "transform 0.15s ease",
    "&:hover": {
        transform: "scale(1.07)",
        background:
            props.btnvariant === "accept"
                ? "linear-gradient(135deg, #3BA55D, #2d7a47)"
                : props.btnvariant === "video"
                ? "linear-gradient(135deg, #4752C4, #3c45a5)"
                : "linear-gradient(135deg, #C62828, #b71c1c)",
    },
}));

const BtnWrap = styled("div")({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
});

const BtnLabel = styled("span")({
    fontSize: "11px",
    color: "rgba(255,255,255,0.45)",
    fontWeight: 500,
});

/* ── component ────────────────────────────────────────────────── */

const IncomingCall = () => {
    const callRequest = useAppSelector((state) => state.videoChat.callRequest);

    const handle = (accepted: boolean, audioOnly: boolean) => {
        callResponse({
            receiverUserId: callRequest!.callerUserId,
            accepted,
            audioOnly,
        });
    };

    return (
        <Backdrop
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 100,
                background: "rgba(0,0,0,0.75)",
                backdropFilter: "blur(10px)",
            }}
            open={!!callRequest?.callerUserId}
        >
            <Card>
                {/* Avatar with circular ripple rings */}
                <AvatarArea>
                    <Ripple delay="0s" />
                    <Ripple delay="0.7s" />
                    <Avatar username={callRequest?.callerName ?? "?"} large />
                </AvatarArea>

                {/* Call type pill */}
                <CallTypePill>
                    <AnimatedIcon>
                        {callRequest?.audioOnly
                            ? <CallIcon sx={{ fontSize: 13 }} />
                            : <VideocamIcon sx={{ fontSize: 13 }} />}
                    </AnimatedIcon>
                    {callRequest?.audioOnly ? "Voice Call" : "Video Call"}
                </CallTypePill>

                {/* Caller name + subtitle — properly separated, no overlap */}
                <CallerInfo>
                    <CallerName>{callRequest?.callerName}</CallerName>
                    <CallerSubtitle>is calling you…</CallerSubtitle>
                </CallerInfo>

                {/* Action buttons */}
                <ButtonsRow>
                    {!callRequest?.audioOnly && (
                        <BtnWrap>
                            <CallBtn btnvariant="video" onClick={() => handle(true, false)}>
                                <VideocamIcon sx={{ fontSize: 26 }} />
                            </CallBtn>
                            <BtnLabel>Video</BtnLabel>
                        </BtnWrap>
                    )}
                    <BtnWrap>
                        <CallBtn btnvariant="accept" onClick={() => handle(true, true)}>
                            <CallIcon sx={{ fontSize: 26 }} />
                        </CallBtn>
                        <BtnLabel>Audio</BtnLabel>
                    </BtnWrap>
                    <BtnWrap>
                        <CallBtn btnvariant="reject" onClick={() => handle(false, true)}>
                            <CallEndIcon sx={{ fontSize: 26 }} />
                        </CallBtn>
                        <BtnLabel>Decline</BtnLabel>
                    </BtnWrap>
                </ButtonsRow>
            </Card>
        </Backdrop>
    );
};

export default IncomingCall;