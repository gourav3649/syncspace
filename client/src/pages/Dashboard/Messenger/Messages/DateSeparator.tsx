import React from "react";
import { styled } from "@mui/system";

const Separator = styled("div")({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "24px 24px 8px 24px",
    "&::before, &::after": {
        content: '""',
        flex: 1,
        height: "1px",
        background: "rgba(255,255,255,0.04)",
    },
});

const DateLabel = styled("span")({
    color: "#7D8795",
    fontSize: "12px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
});

const DateSeparator = ({ date }: { date: string }) => {
    const label = new Date(date).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    return (
        <Separator>
            <DateLabel>{label}</DateLabel>
        </Separator>
    );
};

export default DateSeparator;
