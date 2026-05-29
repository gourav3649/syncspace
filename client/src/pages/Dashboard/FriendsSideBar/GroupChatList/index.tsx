import React from "react";
import { styled } from "@mui/system";
import { useAppSelector } from "../../../../store";
import GroupChatListItem from "./GroupChatListItem";


const MainContainer = styled("div")({
    flexGrow: 1,
    width: "100%",
    margin: "20px 0",
});

const EmptyState = styled("div")({
  color: "#7D8795",
  fontSize: "13px",
  padding: "16px 8px",
  textAlign: "center",
  background: "rgba(255,255,255,0.02)",
  borderRadius: "8px",
  margin: "4px 0 16px 0",
});

const GroupChatList = () => {
    const { groupChatList } = useAppSelector((state) => state.friends);

    return (
        <MainContainer>
            {groupChatList.length === 0 && (
                <EmptyState>
                    You are not in any groups yet.
                </EmptyState>
            )}
            {groupChatList.map((chat) => (
                <GroupChatListItem
                    chat={chat}
                    key={chat.groupId}
                />
            ))}
        </MainContainer>
    );
};

export default GroupChatList;
