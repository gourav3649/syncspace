import React from "react";
import { styled } from "@mui/system";

const Separator = styled("div")({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    "&::before, &::after": {
        content: '""',
        flex: 1,
        height: "1px",
        background: "rgba(255,255,255,0.08)",
    },
});

const DateLabel = styled("span")({
    color: "rgba(255,255,255,0.3)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.5px",
    whiteSpace: "nowrap",
    padding: "2px 8px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "10px",
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
