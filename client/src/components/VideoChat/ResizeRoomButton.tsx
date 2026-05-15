import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import Tooltip from "@mui/material/Tooltip";

const ResizeRoomButton: React.FC<{
    isRoomMinimized: boolean;
    handleRoomResize: () => void;
}> = ({ isRoomMinimized, handleRoomResize }) => {
    return (
        <Tooltip title={isRoomMinimized ? "Expand" : "Minimize"}>
            <IconButton
                onClick={handleRoomResize}
                sx={{
                    color: "rgba(255,255,255,0.5)",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "10px",
                    width: "40px",
                    height: "40px",
                    transition: "all 0.15s ease",
                    "&:hover": {
                        color: "rgba(255,255,255,0.85)",
                        background: "rgba(255,255,255,0.12)",
                    },
                }}
            >
                {isRoomMinimized
                    ? <OpenInFullIcon sx={{ fontSize: 18 }} />
                    : <CloseFullscreenIcon sx={{ fontSize: 18 }} />}
            </IconButton>
        </Tooltip>
    );
};

export default ResizeRoomButton;
