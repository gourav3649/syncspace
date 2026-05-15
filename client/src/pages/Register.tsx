import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/system";
import AuthBox from "../components/AuthBox";
import { validateRegisterForm } from "../utils/validators";
import { useAppSelector } from "../store";
import { registerUser } from "../actions/authActions";

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
    margin: "0 0 28px 0",
});

const FieldGroup = styled("div")({
    display: "flex",
    flexDirection: "column",
    marginBottom: "16px",
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
        borderColor: "#57F287",
        background: "rgba(87,242,135,0.07)",
        boxShadow: "0 0 0 3px rgba(87,242,135,0.12)",
    },
});

const RegisterBtn = styled("button")<{ disabled?: boolean }>((props) => ({
    width: "100%",
    height: "50px",
    border: "none",
    borderRadius: "12px",
    background: props.disabled
        ? "rgba(87,242,135,0.2)"
        : "linear-gradient(135deg, #57F287 0%, #3BA55D 100%)",
    color: props.disabled ? "rgba(255,255,255,0.4)" : "#ffffff",
    fontSize: "16px",
    fontWeight: 600,
    cursor: props.disabled ? "not-allowed" : "pointer",
    marginTop: "8px",
    marginBottom: "24px",
    transition: "all 0.2s ease",
    boxShadow: props.disabled ? "none" : "0 8px 24px rgba(87,242,135,0.3)",
    "&:hover": {
        transform: props.disabled ? "none" : "translateY(-1px)",
        boxShadow: props.disabled ? "none" : "0 12px 28px rgba(87,242,135,0.4)",
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
    color: "#57F287",
    fontWeight: 600,
    cursor: "pointer",
    transition: "color 0.2s",
    "&:hover": {
        color: "#3BA55D",
        textDecoration: "underline",
    },
});

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [credentials, setCredentials] = useState({ email: "", password: "", username: "" });
    const [isFormValid, setIsFormValid] = useState(false);
    const { userDetails } = useAppSelector((state) => state.auth);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleRegister = () => {
        if (isFormValid) dispatch(registerUser(credentials));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleRegister();
    };

    useEffect(() => {
        setIsFormValid(validateRegisterForm(credentials));
    }, [credentials]);

    useEffect(() => {
        if (userDetails?.token) navigate("/dashboard");
    }, [userDetails, navigate]);

    return (
        <AuthBox>
            <Title>Create account</Title>
            <Subtitle>Join SyncSpace and start chatting</Subtitle>

            <FieldGroup>
                <Label>Username</Label>
                <Input
                    type="text"
                    placeholder="cooluser"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="username"
                />
            </FieldGroup>

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
                    placeholder="Min 6 characters"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    autoComplete="new-password"
                />
            </FieldGroup>

            <RegisterBtn disabled={!isFormValid} onClick={handleRegister}>
                Create Account
            </RegisterBtn>

            <Footer>
                Already have an account?{" "}
                <Link onClick={() => navigate("/login")}>Sign in</Link>
            </Footer>
        </AuthBox>
    );
};

export default Register;
