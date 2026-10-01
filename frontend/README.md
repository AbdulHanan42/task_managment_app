# Taskflow Frontend

Vue 3, Vite, Pinia, Vue Router, and Tailwind CSS frontend for the FastAPI task API.

## Run locally

1. Set `VITE_API_URL` in `.env` (defaults to `http://127.0.0.1:8000`).
2. Start the backend and allow the frontend origin in `CORS_ORIGINS`.
3. Run `npm install`, then `npm run dev`.

The API supports registration, login, current-user lookup, profile updates, and task CRUD. There is no user list or role-based administration API.

## Checks

- `npm run lint`
- `npm run format:check`
- `npm run build`# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
