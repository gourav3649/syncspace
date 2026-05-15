import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { styled } from "@mui/system";
import AuthBox from '../components/AuthBox';
import { validateLoginForm } from "../utils/validators";
import { loginUser } from "../actions/authActions";
import { useAppSelector } from '../store';

const Title = styled("h1")({
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: 700,
    margin: "0 0 6px 0",
    letterSpacing: "-0.5px",
});

const Subtitle = styled("p")({
    color: "rgba(255,255,255,0.5)",
    fontSize: "15px",
    margin: "0 0 32px 0",
});

const FieldGroup = styled("div")({
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
});

const Label = styled("label")({
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    fontWeight: 700,
    fontSize: "11px",
    letterSpacing: "0.8px",
    marginBottom: "8px",
});

const Input = styled("input")({
    height: "48px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "12px",
    color: "#ffffff",
    fontSize: "15px",
    padding: "0 16px",
    outline: "none",
    transition: "all 0.2s ease",
    "&::placeholder": {
        color: "rgba(255,255,255,0.25)",
    },
    "&:focus": {
        borderColor: "#5865F2",
        background: "rgba(88,101,242,0.1)",
        boxShadow: "0 0 0 3px rgba(88,101,242,0.15)",
    },
});

const LoginBtn = styled("button")<{ disabled?: boolean }>((props) => ({
    width: "100%",
    height: "50px",
    border: "none",
    borderRadius: "12px",
    background: props.disabled
        ? "rgba(88,101,242,0.3)"
        : "linear-gradient(135deg, #5865F2 0%, #4752C4 100%)",
    color: props.disabled ? "rgba(255,255,255,0.4)" : "#ffffff",
    fontSize: "16px",
    fontWeight: 600,
    cursor: props.disabled ? "not-allowed" : "pointer",
    marginTop: "8px",
    marginBottom: "24px",
    transition: "all 0.2s ease",
    boxShadow: props.disabled ? "none" : "0 8px 24px rgba(88,101,242,0.35)",
    "&:hover": {
        transform: props.disabled ? "none" : "translateY(-1px)",
        boxShadow: props.disabled ? "none" : "0 12px 28px rgba(88,101,242,0.45)",
    },
    "&:active": {
        transform: props.disabled ? "none" : "translateY(0px)",
    },
}));

const Footer = styled("p")({
    color: "rgba(255,255,255,0.4)",
    fontSize: "14px",
    textAlign: "center",
    margin: 0,
});

const Link = styled("span")({
    color: "#5865F2",
    fontWeight: 600,
    cursor: "pointer",
    transition: "color 0.2s",
    "&:hover": {
        color: "#7289da",
        textDecoration: "underline",
    },
});

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [isFormValid, setIsFormValid] = useState(false);
    const { userDetails } = useAppSelector(state => state.auth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = () => {
        if (isFormValid) dispatch(loginUser(credentials));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleLogin();
    };

    useEffect(() => {
        setIsFormValid(validateLoginForm(credentials));
    }, [credentials]);

    useEffect(() => {
        if (userDetails?.token) navigate("/dashboard");
    }, [userDetails, navigate]);

    return (
        <AuthBox>
            <Title>Welcome back</Title>
            <Subtitle>Sign in to continue to SyncSpace</Subtitle>

            <FieldGroup>
                <Label>Email address</Label>
                <Input
                    type="email"
                    placeholder="you@example.com"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="email"
                />
            </FieldGroup>

            <FieldGroup>
                <Label>Password</Label>
                <Input
                    type="password"
                    placeholder="••••••••"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="current-password"
                />
            </FieldGroup>

            <LoginBtn disabled={!isFormValid} onClick={handleLogin}>
                Sign In
            </LoginBtn>

            <Footer>
                Don't have an account?{" "}
                <Link onClick={() => navigate("/register")}>Create one</Link>
            </Footer>
        </AuthBox>
    );
};

export default Login;