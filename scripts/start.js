#!/usr/bin/env node

// Ensure CRA dev server ignores a stale HOST from the parent shell.
delete process.env.HOST;
process.env.DANGEROUSLY_DISABLE_HOST_CHECK = "true";

require("react-scripts/scripts/start");
