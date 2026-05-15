import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import Tooltip from "@mui/material/Tooltip";

const Camera: React.FC<{ localStream: MediaStream }> = ({ localStream }) => {
    const [enabled, setEnabled] = useState(true);

    const toggle = () => {
        localStream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
        setEnabled(!enabled);
    };

    return (
        <Tooltip title={enabled ? "Turn off camera" : "Turn on camera"}>
            <IconButton
                onClick={toggle}
                sx={{
                    color: enabled ? "rgba(255,255,255,0.75)" : "#ED4245",
                    background: enabled ? "rgba(255,255,255,0.06)" : "rgba(237,66,69,0.15)",
                    borderRadius: "10px",
                    width: "40px",
                    height: "40px",
                    transition: "all 0.15s ease",
                    "&:hover": {
                        background: enabled ? "rgba(255,255,255,0.12)" : "rgba(237,66,69,0.25)",
                    },
                }}
            >
                {enabled ? <VideocamIcon sx={{ fontSize: 20 }} /> : <VideocamOffIcon sx={{ fontSize: 20 }} />}
            </IconButton>
        </Tooltip>
    );
};

export default Camera;
