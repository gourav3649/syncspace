import React, { useState } from "react";
import Button from "@mui/material/Button";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddFriendDialog from "./AddFriendDialog";

const AddFriendButton = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
            <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                onClick={() => setIsDialogOpen(true)}
                sx={{
                    background: "linear-gradient(135deg, #5865F2 0%, #4752C4 100%)",
                    color: "white",
                    textTransform: "none",
                    fontSize: "13px",
                    fontWeight: 600,
                    height: "34px",
                    borderRadius: "8px",
                    padding: "0 12px",
                    boxShadow: "0 4px 12px rgba(88,101,242,0.35)",
                    whiteSpace: "nowrap",
                    "&:hover": {
                        background: "linear-gradient(135deg, #4752C4 0%, #3c45a5 100%)",
                        boxShadow: "0 6px 16px rgba(88,101,242,0.45)",
                    },
                }}
            >
                Add Friend
            </Button>
            <AddFriendDialog
                isDialogOpen={isDialogOpen}
                closeDialogHandler={() => setIsDialogOpen(false)}
            />
        </>
    );
};

export default AddFriendButton;
