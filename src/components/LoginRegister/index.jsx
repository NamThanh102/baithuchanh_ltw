import React, { useState } from "react";
import { Alert, Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || "";

function LoginRegister({ onLogin }) {
	const [loginForm, setLoginForm] = useState({ login_name: "", password: "" });
	const [registerForm, setRegisterForm] = useState({
		login_name: "",
		password: "",
		confirmPassword: "",
		first_name: "",
		last_name: "",
		location: "",
		description: "",
		occupation: "",
	});
	const [loginError, setLoginError] = useState("");
	const [registerError, setRegisterError] = useState("");
	const [registerSuccess, setRegisterSuccess] = useState("");

	const handleLoginSubmit = async (event) => {
		event.preventDefault();
		setLoginError("");

		try {
			const response = await fetch(`${apiBaseUrl}/admin/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					login_name: loginForm.login_name,
					password: loginForm.password,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data?.message || "Login failed");
			}

			onLogin(data);
		} catch (error) {
			setLoginError(error.message || "Login failed");
		}
	};

	const handleRegisterSubmit = async (event) => {
		event.preventDefault();
		setRegisterError("");
		setRegisterSuccess("");

		if (registerForm.password !== registerForm.confirmPassword) {
			setRegisterError("Password and confirm password must match");
			return;
		}

		try {
			const response = await fetch(`${apiBaseUrl}/user`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					login_name: registerForm.login_name,
					password: registerForm.password,
					first_name: registerForm.first_name,
					last_name: registerForm.last_name,
					location: registerForm.location,
					description: registerForm.description,
					occupation: registerForm.occupation,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data?.message || "Registration failed");
			}

			setRegisterSuccess("Registered successfully. Please login.");
			setRegisterForm({
				login_name: "",
				password: "",
				confirmPassword: "",
				first_name: "",
				last_name: "",
				location: "",
				description: "",
				occupation: "",
			});
		} catch (error) {
			setRegisterError(error.message || "Registration failed");
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Grid container spacing={3}>
				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 3 }}>
						<Typography variant="h6" gutterBottom>
							Login
						</Typography>
						<Box component="form" onSubmit={handleLoginSubmit} sx={{ display: "grid", gap: 2 }}>
							<TextField
								label="Login Name"
								value={loginForm.login_name}
								onChange={(event) => setLoginForm({ ...loginForm, login_name: event.target.value })}
								size="small"
								fullWidth
							/>
							<TextField
								label="Password"
								type="password"
								value={loginForm.password}
								onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
								size="small"
								fullWidth
							/>
							{loginError ? <Alert severity="error">{loginError}</Alert> : null}
							<Button type="submit" variant="contained">
								Login
							</Button>
						</Box>
					</Paper>
				</Grid>

				<Grid item xs={12} md={6}>
					<Paper sx={{ p: 3 }}>
						<Typography variant="h6" gutterBottom>
							Register
						</Typography>
						<Box component="form" onSubmit={handleRegisterSubmit} sx={{ display: "grid", gap: 2 }}>
							<TextField
								label="Login Name"
								value={registerForm.login_name}
								onChange={(event) => setRegisterForm({ ...registerForm, login_name: event.target.value })}
								size="small"
								fullWidth
							/>
							<TextField
								label="Password"
								type="password"
								value={registerForm.password}
								onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
								size="small"
								fullWidth
							/>
							<TextField
								label="Confirm Password"
								type="password"
								value={registerForm.confirmPassword}
								onChange={(event) => setRegisterForm({ ...registerForm, confirmPassword: event.target.value })}
								size="small"
								fullWidth
							/>
							<TextField
								label="First Name"
								value={registerForm.first_name}
								onChange={(event) => setRegisterForm({ ...registerForm, first_name: event.target.value })}
								size="small"
								fullWidth
							/>
							<TextField
								label="Last Name"
								value={registerForm.last_name}
								onChange={(event) => setRegisterForm({ ...registerForm, last_name: event.target.value })}
								size="small"
								fullWidth
							/>
							<TextField
								label="Location"
								value={registerForm.location}
								onChange={(event) => setRegisterForm({ ...registerForm, location: event.target.value })}
								size="small"
								fullWidth
							/>
							<TextField
								label="Description"
								value={registerForm.description}
								onChange={(event) => setRegisterForm({ ...registerForm, description: event.target.value })}
								size="small"
								fullWidth
								multiline
								minRows={2}
							/>
							<TextField
								label="Occupation"
								value={registerForm.occupation}
								onChange={(event) => setRegisterForm({ ...registerForm, occupation: event.target.value })}
								size="small"
								fullWidth
							/>
							{registerError ? <Alert severity="error">{registerError}</Alert> : null}
							{registerSuccess ? <Alert severity="success">{registerSuccess}</Alert> : null}
							<Button type="submit" variant="contained">
								Register
							</Button>
						</Box>
					</Paper>
				</Grid>
			</Grid>
		</Box>
	);
}

export default LoginRegister;
