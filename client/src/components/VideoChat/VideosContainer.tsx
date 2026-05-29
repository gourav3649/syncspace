import React, { useEffect, useRef } from "react";
import { styled } from "@mui/system";
import { useAppSelector } from "../../store";
import { Typography } from "@mui/material";

/*
 * WhatsApp-style layout:
 *
 *  ┌────────────────────────────────────────────────┐
 *  │                                                │
 *  │         Remote video(s)  — fills 100%          │
 *  │         (or ringing / rejected status)         │
 *  │                                                │
 *  │                       ┌──────────┐             │
 *  │                       │  LOCAL   │  ← PIP box  │
 *  │                       │  (you)   │             │
 *  │                       └──────────┘             │
 *  └────────────────────────────────────────────────┘
 *
 * For group rooms with multiple remote streams, the remote area
 * is a CSS Grid that auto-distributes tiles — no overflow/scroll.
 */

/* ── outer container — fills whatever space VideoChat gives it ── */
const Outer = styled("div")({
    flex: 1,
    position: "relative",
    background: "#0F1115",
    overflow: "hidden",          // ← never scrolls
    minHeight: 0,
});

/* ── remote area: grid of remote video tiles ─────────────────── */
const RemoteGrid = styled("div")<{ count: number }>((props) => {
    // Decide grid columns based on remote participant count
    const cols =
        props.count <= 1 ? 1
        : props.count <= 4 ? 2
        : props.count <= 9 ? 3
        : 4;

    return {
        position: "absolute",
        inset: 0,
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridAutoRows: "1fr",
        gap: "12px",
        padding: "16px",
        background: "#0F1115",
    };
});

/* ── single remote tile fills its grid cell ─────────────────── */
const RemoteTile = styled("div")({
    position: "relative",
    background: "#171C26",
    borderRadius: "16px",
    overflow: "hidden",
    minHeight: 0,
    minWidth: 0,
    border: "1px solid rgba(255,255,255,0.04)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
});

const ParticipantLabel = styled("span")({
    position: "absolute",
    bottom: "12px",
    left: "12px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#F5F7FB",
    background: "rgba(15,17,21,0.6)",
    borderRadius: "6px",
    padding: "4px 10px",
    backdropFilter: "blur(8px)",
});

/* ── local PIP (picture-in-picture) box ─────────────────────── */
const PipBox = styled("div")({
    position: "absolute",
    bottom: "84px",              // sit above the control bar
    right: "24px",
    width: "180px",
    height: "120px",
    borderRadius: "12px",
    overflow: "hidden",
    border: "2px solid rgba(91,115,255,0.3)",
    boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
    background: "#1D2430",
    zIndex: 10,
    "& video": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
    },
});

const YouLabel = styled("span")({
    position: "absolute",
    bottom: "6px",
    left: "8px",
    fontSize: "10px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.7)",
    background: "rgba(0,0,0,0.5)",
    borderRadius: "4px",
    padding: "1px 6px",
});

/* ── status overlay (ringing / rejected) ────────────────────── */
const StatusOverlay = styled("div")({
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
});

const StatusPill = styled("div")({
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    padding: "12px 24px",
    fontSize: "15px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: "0.2px",
});

/* ── helper: detect if a stream is a screen share (has a display-surface track) ── */
function isScreenShareStream(stream: MediaStream): boolean {
    return stream.getVideoTracks().some((track) => {
        const settings = track.getSettings() as any;
        return (
            settings?.displaySurface != null ||
            track.label?.toLowerCase().includes("screen") ||
            track.label?.toLowerCase().includes("display") ||
            track.label?.toLowerCase().includes("window")
        );
    });
}

/* ── tiny hook: attach stream to video element ───────────────── */
const RemoteVideo: React.FC<{ stream: MediaStream }> = ({ stream }) => {
    const ref = useRef<HTMLVideoElement>(null);
    const isScreen = isScreenShareStream(stream);
    useEffect(() => {
        if (!ref.current) return;
        ref.current.srcObject = stream;
        ref.current.onloadedmetadata = () => ref.current?.play();
    }, [stream]);
    return (
        <video
            ref={ref}
            autoPlay
            playsInline
            style={{
                width: "100%",
                height: "100%",
                objectFit: isScreen ? "contain" : "cover",
                display: "block",
                background: isScreen ? "#000" : undefined,
            }}
        />
    );
};

const LocalVideo: React.FC<{ stream: MediaStream }> = ({ stream }) => {
    const ref = useRef<HTMLVideoElement>(null);
    const isScreen = isScreenShareStream(stream);
    useEffect(() => {
        if (!ref.current) return;
        ref.current.srcObject = stream;
        ref.current.muted = true;
        ref.current.volume = 0;
        ref.current.onloadedmetadata = () => ref.current?.play();
    }, [stream]);
    return (
        <video
            ref={ref}
            autoPlay
            muted
            playsInline
            style={{
                width: "100%",
                height: "100%",
                objectFit: isScreen ? "contain" : "cover",
                display: "block",
                background: isScreen ? "#000" : undefined,
            }}
        />
    );
};

/* ── main component ─────────────────────────────────────────── */
const VideosContainer: React.FC<{ isRoomMinimized: boolean }> = ({ isRoomMinimized }) => {
    const {
        videoChat: { localStream, callStatus, remoteStream, screenSharingStream, audioOnly },
        room: { localStreamRoom, remoteStreams, screenSharingStream: screenSharingStreamRoom },
    } = useAppSelector((state) => state);

    const isDirectCall = !!localStream;
    const isRoomCall = !!localStreamRoom && !isDirectCall;

    /* ── determine what to show as the local PIP stream ── */
    const localPip = isDirectCall
        ? (screenSharingStream ?? localStream)
        : isRoomCall
        ? (screenSharingStreamRoom ?? localStreamRoom)
        : null;

    /* ── all remote streams for the grid ── */
    const remoteList: MediaStream[] = isDirectCall
        ? remoteStream ? [remoteStream] : []
        : remoteStreams;

    const remoteCount = remoteList.length;

    return (
        <Outer>
            {/* Remote video grid */}
            <RemoteGrid count={Math.max(remoteCount, 1)}>
                {remoteList.map((stream, i) => (
                    <RemoteTile key={stream.id ?? i}>
                        <RemoteVideo stream={stream} />
                    </RemoteTile>
                ))}

                {/* Empty placeholder tile when no remote yet (ringing / audio-only) */}
                {remoteCount === 0 && (
                    <RemoteTile
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    />
                )}
            </RemoteGrid>

            {/* Ringing / rejected status pill — floats over the dark background */}
            {callStatus !== "accepted" && callStatus !== null && (
                <StatusOverlay>
                    <StatusPill>
                        {callStatus === "ringing"
                            ? "🔔 Ringing…"
                            : callStatus === "rejected"
                            ? "❌ Call Declined"
                            : null}
                    </StatusPill>
                </StatusOverlay>
            )}

            {/* Local PIP box — bottom-right corner */}
            {localPip && (
                <PipBox>
                    <LocalVideo stream={localPip} />
                    <YouLabel>You</YouLabel>
                </PipBox>
            )}
        </Outer>
    );
};

export default VideosContainer;
