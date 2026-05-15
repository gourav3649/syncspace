import React from "react";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Avatar from "../../../../components/Avatar";
import InvitationDecisionButtons from "./InvitationDecisionButtons";
import { styled } from "@mui/system";

interface Props {
    id: string;
    username: string;
    email: string;
}

const ItemRow = styled("div")({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 4px",
    borderRadius: "8px",
    marginBottom: "4px",
    transition: "background 0.15s ease",
    "&:hover": {
        background: "rgba(255,255,255,0.05)",
    },
});

const Name = styled(Typography)({
    flex: 1,
    fontSize: "13px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.7)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
}) as typeof Typography;

const PendingInvitationsListItem = ({ id, username, email }: Props) => {
    return (
        <ItemRow title={email}>
            <Avatar username={username} />
            <Name>{username}</Name>
            <InvitationDecisionButtons invitationId={id} />
        </ItemRow>
    );
};

export default PendingInvitationsListItem;
