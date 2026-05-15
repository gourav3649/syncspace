import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import VideoChat from "../../../components/VideoChat";
import IncomingCall from "../../../components/IncomingCall";
import Messenger from "../Messenger/Messenger";
import AddFriendButton from "../FriendsSideBar/AddFriendButton";
import FriendsList from "../FriendsSideBar/FriendsList/FriendsList";
import FriendsTitle from "../FriendsSideBar/FriendsTitle";
import PendingInvitationsList from "../FriendsSideBar/PendingInvitationsList/PendingInvitationsList";
import DropDownMenu from "./DropdownMenu";
import CreateRoomButton from "./CreateRoomButton";
import CreateGroupChatButton from "./CreateGroupChatButton";
import GroupChatList from "../FriendsSideBar/GroupChatList";
import ActiveRooms from "../ActiveRooms";

const drawerWidth = 260;

// Discord-inspired dark sidebar colors
const SIDEBAR_BG = "#1e1f22";
const SIDEBAR_SECTION_DIVIDER = "rgba(255,255,255,0.06)";

interface Props {
    window?: () => Window;
    localStream: MediaStream | null;
    isUserInRoom: boolean;
}

export default function ResponsiveDrawer(props: Props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [desktopOpen, setDesktopOpen] = React.useState(true);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDesktopToggle = () => {
        setDesktopOpen(!desktopOpen);
    };

    const SectionDivider = () => (
        <div
            style={{
                height: "1px",
                background: SIDEBAR_SECTION_DIVIDER,
                margin: "8px 0",
            }}
        />
    );

    const drawer = (
        <div
            style={{
                backgroundColor: SIDEBAR_BG,
                height: "100%",
                overflowY: "auto",
                overflowX: "hidden",
                display: "flex",
                flexDirection: "column",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.1) transparent",
            }}
        >
            {/* Top bar: Add friend + menu + collapse button */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 12px 12px 12px",
                    borderBottom: `1px solid ${SIDEBAR_SECTION_DIVIDER}`,
                    position: "sticky",
                    top: 0,
                    background: SIDEBAR_BG,
                    zIndex: 10,
                }}
            >
                <AddFriendButton />
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <DropDownMenu />
                    {/* Desktop collapse button */}
                    <IconButton
                        onClick={handleDesktopToggle}
                        size="small"
                        title="Collapse sidebar"
                        sx={{
                            display: { xs: "none", sm: "flex" },
                            color: "rgba(255,255,255,0.5)",
                            borderRadius: "6px",
                            padding: "4px",
                            "&:hover": {
                                color: "white",
                                background: "rgba(255,255,255,0.08)",
                            },
                        }}
                    >
                        <ChevronLeftIcon fontSize="small" />
                    </IconButton>
                </div>
            </div>

            {/* Action buttons */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 12px",
                }}
            >
                <div style={{ flex: 1 }}>
                    <CreateGroupChatButton />
                </div>
                <div style={{ flex: 1 }}>
                    <CreateRoomButton isUserInRoom={props.isUserInRoom} />
                </div>
            </div>

            <SectionDivider />

            {/* Active Rooms */}
            <div style={{ padding: "4px 12px" }}>
                <FriendsTitle title="Active Rooms" />
                <ActiveRooms />
            </div>

            <SectionDivider />

            {/* Private Messages */}
            <div style={{ padding: "4px 12px", flex: 1 }}>
                <FriendsTitle title="Private Messages" />
                <FriendsList />
            </div>

            <SectionDivider />

            {/* Group Chats */}
            <div style={{ padding: "4px 12px" }}>
                <FriendsTitle title="Group Chats" />
                <GroupChatList />
            </div>

            <SectionDivider />

            {/* Pending Invitations */}
            <div style={{ padding: "4px 12px 16px 12px" }}>
                <FriendsTitle title="Invitations" />
                <PendingInvitationsList />
            </div>
        </div>
    );

    const container =
        window !== undefined ? () => window().document.body : undefined;

    const effectiveDesktopWidth = desktopOpen ? drawerWidth : 0;

    return (
        <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <CssBaseline />

            {/* Mobile hamburger */}
            <IconButton
                style={{
                    position: "fixed",
                    top: 10,
                    left: 14,
                    zIndex: 1300,
                    color: "white",
                    background: "rgba(0,0,0,0.4)",
                    borderRadius: "8px",
                    width: "36px",
                    height: "36px",
                }}
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { sm: "none" } }}
            >
                <MenuIcon fontSize="small" />
            </IconButton>

            {/* Desktop expand button — visible only when sidebar is collapsed */}
            {!desktopOpen && (
                <IconButton
                    onClick={handleDesktopToggle}
                    title="Expand sidebar"
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        position: "fixed",
                        top: 10,
                        left: 10,
                        zIndex: 1300,
                        color: "rgba(255,255,255,0.7)",
                        background: SIDEBAR_BG,
                        border: `1px solid ${SIDEBAR_SECTION_DIVIDER}`,
                        borderRadius: "8px",
                        width: "36px",
                        height: "36px",
                        "&:hover": {
                            background: "rgba(255,255,255,0.1)",
                            color: "white",
                        },
                        transition: "all 0.2s ease",
                    }}
                >
                    <MenuIcon fontSize="small" />
                </IconButton>
            )}

            <Box
                component="nav"
                sx={{
                    width: { sm: effectiveDesktopWidth },
                    flexShrink: { sm: 0 },
                    transition: "width 0.25s ease",
                    overflow: "hidden",
                }}
            >
                {/* Mobile drawer */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            background: SIDEBAR_BG,
                            border: "none",
                        },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop collapsible drawer */}
                <Drawer
                    variant="persistent"
                    open={desktopOpen}
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": {
                            boxSizing: "border-box",
                            width: drawerWidth,
                            background: SIDEBAR_BG,
                            border: "none",
                            borderRight: `1px solid ${SIDEBAR_SECTION_DIVIDER}`,
                            transition: "transform 0.25s ease",
                            overflowX: "hidden",
                        },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main content area */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    background: "#313338",
                    width: {
                        xs: "100vw",
                        sm: `calc(100vw - ${effectiveDesktopWidth}px)`,
                    },
                    height: "100vh",
                    overflow: "hidden",
                    transition: "width 0.25s ease",
                }}
            >
                <Messenger />
                {props.localStream && <VideoChat />}
                <IncomingCall />
            </Box>
        </Box>
    );
}
