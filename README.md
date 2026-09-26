# Todo app

A basic todo list built with Node.js and the built-in `http` module. Todos are stored in memory, so restarting the server resets the list.

## Run

```bash
npm start
```

Open http://localhost:3000 in your browser.

## Frontend

The frontend is a lightweight static UI in the repository root:

- `/index.html`
- `/styles.css`
- `/app.js`

It connects to the existing API endpoints and supports:

- listing todos (`GET /api/todos`)
- creating todos (`POST /api/todos`)
- marking todos complete/incomplete (`PATCH /api/todos/:id`)
- deleting todos (`DELETE /api/todos/:id`)
