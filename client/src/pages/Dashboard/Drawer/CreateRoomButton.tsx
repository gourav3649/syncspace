import React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import AddIcon from "@mui/icons-material/Add";
import { createNewRoom } from "../../../socket/roomHandler";

const CreateRoomButton = ({ isUserInRoom }: { isUserInRoom: boolean }) => {
    return (
        <Tooltip title={isUserInRoom ? "Already in a room" : "Create Voice Room"} placement="bottom">
            <span style={{ width: "100%" }}>
                <Button
                    disabled={isUserInRoom}
                    onClick={createNewRoom}
                    fullWidth
                    sx={{
                        height: "34px",
                        borderRadius: "8px",
                        background: isUserInRoom
                            ? "rgba(255,255,255,0.04)"
                            : "rgba(87,242,135,0.12)",
                        color: isUserInRoom ? "rgba(255,255,255,0.2)" : "#57F287",
                        border: `1px solid ${isUserInRoom ? "rgba(255,255,255,0.06)" : "rgba(87,242,135,0.25)"}`,
                        textTransform: "none",
                        fontSize: "12px",
                        fontWeight: 600,
                        gap: "4px",
                        "&:hover": {
                            background: "rgba(87,242,135,0.18)",
                        },
                        "&:disabled": {
                            color: "rgba(255,255,255,0.2)",
                        },
                    }}
                    startIcon={<VolumeUpIcon sx={{ fontSize: "14px !important" }} />}
                >
                    New Room
                </Button>
            </span>
        </Tooltip>
    );
};

export default CreateRoomButton;
