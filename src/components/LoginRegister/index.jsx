import React, { useState } from "react";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";

function LoginRegister({ onLogin }) {
	const [loginName, setLoginName] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [loginMessage, setLoginMessage] = useState("");

	const [registerData, setRegisterData] = useState({
		login_name: "",
		password: "",
		confirmPassword: "",
		first_name: "",
		last_name: "",
		location: "",
		description: "",
		occupation: "",
	});
	const [registerMessage, setRegisterMessage] = useState("");

	const handleLogin = async (event) => {
		event.preventDefault();
		setLoginMessage("");

		const response = await fetch("/admin/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ login_name: loginName, password: loginPassword }),
		});

		if (!response.ok) {
			setLoginMessage("Login failed. Please check your login name and password.");
			return;
		}

		const user = await response.json();
		setLoginName("");
		setLoginPassword("");
		setLoginMessage("");
		onLogin(user);
	};

	const handleRegister = async (event) => {
		event.preventDefault();
		setRegisterMessage("");

		if (!registerData.login_name || !registerData.password || !registerData.first_name || !registerData.last_name) {
			setRegisterMessage("Please fill in all required fields.");
			return;
		}

		if (registerData.password !== registerData.confirmPassword) {
			setRegisterMessage("Passwords do not match.");
			return;
		}

		const response = await fetch("/user", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({
				login_name: registerData.login_name,
				password: registerData.password,
				first_name: registerData.first_name,
				last_name: registerData.last_name,
				location: registerData.location,
				description: registerData.description,
				occupation: registerData.occupation,
			}),
		});

		if (!response.ok) {
			const errorText = await response.json().catch(() => ({}));
			setRegisterMessage(errorText.message || "Registration failed.");
			return;
		}

		setRegisterMessage("Registration successful. Please log in.");
		setRegisterData({
			login_name: "",
			password: "",
			confirmPassword: "",
			first_name: "",
			last_name: "",
			location: "",
			description: "",
			occupation: "",
		});
	};

	return (
		<Box sx={{ maxWidth: 520 }}>
			<Typography variant="h5" gutterBottom>
				Login
			</Typography>
			<Box component="form" onSubmit={handleLogin} sx={{ mb: 3 }}>
				<TextField
					label="Login Name"
					value={loginName}
					onChange={(event) => setLoginName(event.target.value)}
					fullWidth
					margin="normal"
					required
				/>
				<TextField
					label="Password"
					type="password"
					value={loginPassword}
					onChange={(event) => setLoginPassword(event.target.value)}
					fullWidth
					margin="normal"
					required
				/>
				{loginMessage ? (
					<Typography color="error" variant="body2" sx={{ mt: 1 }}>
						{loginMessage}
					</Typography>
				) : null}
				<Button type="submit" variant="contained" sx={{ mt: 2 }}>
					Login
				</Button>
			</Box>

			<Divider sx={{ mb: 3 }} />

			<Typography variant="h5" gutterBottom>
				Register
			</Typography>
			<Box component="form" onSubmit={handleRegister}>
				<TextField
					label="Login Name"
					value={registerData.login_name}
					onChange={(event) =>
						setRegisterData((prev) => ({ ...prev, login_name: event.target.value }))
					}
					fullWidth
					margin="normal"
					required
				/>
				<TextField
					label="Password"
					type="password"
					value={registerData.password}
					onChange={(event) =>
						setRegisterData((prev) => ({ ...prev, password: event.target.value }))
					}
					fullWidth
					margin="normal"
					required
				/>
				<TextField
					label="Confirm Password"
					type="password"
					value={registerData.confirmPassword}
					onChange={(event) =>
						setRegisterData((prev) => ({ ...prev, confirmPassword: event.target.value }))
					}
					fullWidth
					margin="normal"
					required
				/>
				<TextField
					label="First Name"
					value={registerData.first_name}
					onChange={(event) =>
						setRegisterData((prev) => ({ ...prev, first_name: event.target.value }))
					}
					fullWidth
					margin="normal"
					required
				/>
				<TextField
					label="Last Name"
					value={registerData.last_name}
					onChange={(event) =>
						setRegisterData((prev) => ({ ...prev, last_name: event.target.value }))
					}
					fullWidth
					margin="normal"
					required
				/>
				<TextField
					label="Location"
					value={registerData.location}
					onChange={(event) =>
						setRegisterData((prev) => ({ ...prev, location: event.target.value }))
					}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Description"
					value={registerData.description}
					onChange={(event) =>
						setRegisterData((prev) => ({ ...prev, description: event.target.value }))
					}
					fullWidth
					margin="normal"
				/>
				<TextField
					label="Occupation"
					value={registerData.occupation}
					onChange={(event) =>
						setRegisterData((prev) => ({ ...prev, occupation: event.target.value }))
					}
					fullWidth
					margin="normal"
				/>
				{registerMessage ? (
					<Typography
						color={registerMessage.includes("successful") ? "primary" : "error"}
						variant="body2"
						sx={{ mt: 1 }}
					>
						{registerMessage}
					</Typography>
				) : null}
				<Button type="submit" variant="contained" sx={{ mt: 2 }}>
					Register Me
				</Button>
			</Box>
		</Box>
	);
}

export default LoginRegister;
