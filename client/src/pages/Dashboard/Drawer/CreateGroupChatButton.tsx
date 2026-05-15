import React, { useState } from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CreateGroupChatDialog from "./CreateGroupChatDialog";

const CreateGroupChatButton = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
            <Tooltip title="Create Group Chat" placement="bottom">
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    fullWidth
                    sx={{
                        height: "34px",
                        borderRadius: "8px",
                        background: "rgba(88,101,242,0.12)",
                        color: "#7289da",
                        border: "1px solid rgba(88,101,242,0.25)",
                        textTransform: "none",
                        fontSize: "12px",
                        fontWeight: 600,
                        "&:hover": {
                            background: "rgba(88,101,242,0.2)",
                        },
                    }}
                    startIcon={<GroupAddIcon sx={{ fontSize: "14px !important" }} />}
                >
                    New Group
                </Button>
            </Tooltip>
            <CreateGroupChatDialog
                isDialogOpen={isDialogOpen}
                closeDialogHandler={() => setIsDialogOpen(false)}
            />
        </>
    );
};

export default CreateGroupChatButton;
