import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import { validateGroupName } from "../../../utils/validators";
import { Button } from "@mui/material";
import styled from "@emotion/styled";
import { createGroupChatAction } from "../../../actions/groupChatActions";

const Wrapper = styled("div")({
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    width: "100%",
    marginTop: "24px",
});

const Label = styled("p")({
    color: "#B8C0CC",
    textTransform: "uppercase",
    fontWeight: "600",
    fontSize: "12px",
    letterSpacing: "0.5px",
    marginBottom: "8px",
});

const Input = styled("input")({
    flexGrow: 1,
    height: "44px",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px",
    color: "#F5F7FB",
    background: "rgba(255,255,255,0.04)",
    margin: 0,
    fontSize: "15px",
    padding: "0 14px",
    outline: "none",
    transition: "all 0.2s ease",
    "&:focus": {
        border: "1px solid rgba(91,115,255,0.5)",
        background: "rgba(255,255,255,0.06)",
        boxShadow: "0 0 0 3px rgba(91,115,255,0.1)",
    },
});

interface CreateGroupChatDialogProps {
    isDialogOpen: boolean;
    closeDialogHandler: () => void;
}

const CreateGroupChatDialog = ({
    isDialogOpen,
    closeDialogHandler,
}: CreateGroupChatDialogProps) => {
    const [name, setName] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);

    const dispatch = useDispatch();

    const handleCloseDialog = () => {
        closeDialogHandler();
        setName("");
    };

    const handleClick = () => {
        dispatch(createGroupChatAction(name, handleCloseDialog));
    };

    useEffect(() => {
        setIsFormValid(validateGroupName(name));
    }, [name, setIsFormValid]);

    return (
        <div>
            <Dialog open={isDialogOpen} onClose={handleCloseDialog} PaperProps={{ sx: { padding: "8px" } }}>
                <DialogTitle>
                    <Typography sx={{ fontSize: "20px", fontWeight: 700, color: "#F5F7FB" }}>
                        Create a Group Chat
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography sx={{ color: "#7D8795", fontSize: "15px", lineHeight: 1.5 }}>
                            Give your new group a name to get started. You can add friends to the group later.
                        </Typography>
                    </DialogContentText>

                    <Wrapper>
                        <Label>Group Name</Label>
                        <Input
                            type="name"
                            placeholder="e.g. Engineering Team"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Wrapper>
                </DialogContent>
                <DialogActions sx={{ padding: "16px 24px" }}>
                    <Button
                        variant="text"
                        onClick={handleCloseDialog}
                        sx={{
                            color: "#7D8795",
                            textTransform: "none",
                            fontSize: "15px",
                            fontWeight: 600,
                            "&:hover": { color: "#F5F7FB", background: "rgba(255,255,255,0.04)" }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "#5B73FF",
                            color: "white",
                            textTransform: "none",
                            fontSize: "15px",
                            fontWeight: 600,
                            height: "40px",
                            padding: "0 24px",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(91,115,255,0.3)",
                            "&:hover": {
                                bgcolor: "#6b81ff",
                                boxShadow: "0 6px 16px rgba(91,115,255,0.4)",
                            }
                        }}
                        disabled={!isFormValid}
                        onClick={handleClick}
                    >
                        Create Group
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CreateGroupChatDialog;
