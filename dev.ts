import { spawn } from "child_process";
const child = spawn("bunx", ["--bun", "vite"], {
  cwd: "./frontend",
  stdio: "inherit",
  shell: true,
});
child.on("exit", (code) => process.exit(code ?? 0));
