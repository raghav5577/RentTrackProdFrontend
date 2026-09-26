# Todo app

A basic todo list built with Node.js and the built-in `http` module. Todos are stored in memory, so restarting the server resets the list.

## Run

```bash
npm start
```

Open http://localhost:3000 in your browser.

The API exposes `GET` and `POST /api/todos`, plus `PATCH` and `DELETE /api/todos/:id`.