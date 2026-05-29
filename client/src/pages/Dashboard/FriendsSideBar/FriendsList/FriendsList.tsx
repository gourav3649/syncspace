import React from "react";
import { styled } from "@mui/system";
import FriendsListItem from "./FriendsListItem";
import { useAppSelector } from "../../../../store";

const DUMMY_FRIENDS = [
  {
    id: "1",
    username: "Mark",
    isOnline: true,
  },
  {
    id: "2",
    username: "Anna",
    isOnline: false,
  },
  {
    id: "3",
    username: "John",
    isOnline: false,
  },
];

const MainContainer = styled("div")({
  flexGrow: 1,
  width: "100%",
  margin: "20px 0"
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

const FriendsList = () => {
  const { friends, onlineUsers } = useAppSelector(state => state.friends);

  const modifiedFriends = friends.map(friend => {
    const isOnline = onlineUsers.find(user => user.userId === friend.id);

    return {...friend, isOnline: !!isOnline};
  })

  return (
    <MainContainer>
      {modifiedFriends.length === 0 && (
          <EmptyState>
              No direct messages yet.
          </EmptyState>
      )}
      {modifiedFriends.map((f) => (
        <FriendsListItem
          username={f.username}
          id={f.id}
          key={f.id}
          isOnline={f.isOnline}
          email= {f.email}
        />
      ))}
    </MainContainer>
  );
};

export default FriendsList;
