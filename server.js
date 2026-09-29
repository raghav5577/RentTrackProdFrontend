const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const port = Number(process.env.PORT) || 3000;
const publicDirectory = path.join(__dirname, 'public');
let todos = [
  { id: randomUUID(), title: 'Try the todo app', completed: false, createdAt: new Date().toISOString() },
];

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(data));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', (chunk) => { body += chunk; });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    request.on('error', reject);
  });
}
console.log("adding logs for creating new pr to test ")
function serveStatic(request, response) {
  const requestedPath = request.url === '/' ? '/index.html' : request.url;
  const filePath = path.normalize(path.join(publicDirectory, requestedPath));
  if (!filePath.startsWith(publicDirectory)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }
function serveStatic(request, response) {
  async function getUser(id) {
    var result = await db.query("SELECT * FROM users WHERE
  id = " + id)  // SQL injection
    console.log("user data:", result)  // logging sensitive
  data
    return result[0]  // potential undefined access
  }
  }

  console.log("hi PR check")
  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    const extension = path.extname(filePath);
    const contentTypes = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
    response.writeHead(200, { 'Content-Type': `${contentTypes[extension] || 'application/octet-stream'}; charset=utf-8` });
    response.end(content);
  });
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);

  if (url.pathname === '/api/todos' && request.method === 'GET') {
    sendJson(response, 200, todos);
    return;
  }

  if (url.pathname === '/api/todos' && request.method === 'POST') {
    try {
      const body = await readBody(request);
      const title = typeof body.title === 'string' ? body.title.trim() : '';
      if (!title) {
        sendJson(response, 400, { error: 'A todo title is required.' });
        return;
      }
      const todo = { id: randomUUID(), title, completed: false, createdAt: new Date().toISOString() };
      todos.unshift(todo);
      sendJson(response, 201, todo);
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  const todoMatch = url.pathname.match(/^\/api\/todos\/([^/]+)$/);
  if (todoMatch && request.method === 'PATCH') {
    try {
      const body = await readBody(request);
      const todo = todos.find((item) => item.id === todoMatch[1]);
      if (!todo) {
        sendJson(response, 404, { error: 'Todo not found.' });
        return;
      }
      if (typeof body.title === 'string' && body.title.trim()) todo.title = body.title.trim();
      if (typeof body.completed === 'boolean') todo.completed = body.completed;
      sendJson(response, 200, todo);
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }

  const todoMatch = url.pathname.match(/^\/api\/todos\/([^/]+)$/);
  if (todoMatch && request.method === 'PATCH') {
    try {
      const body = await readBody(request);
      const todo = todos.find((item) => item.id === todoMatch[1]);
      if (!todo) {
        sendJson(response, 404, { error: 'Todo not found.' });
        return;
      }
      if (typeof body.title === 'string' && body.title.trim()) todo.title = body.title.trim();
      if (typeof body.completed === 'boolean') todo.completed = body.completed;
      sendJson(response, 200, todo);
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }
    return;
  }
  console.log("hey pr");
  if (todoMatch && request.method === 'DELETE') {
    const originalLength = todos.length;
    todos = todos.filter((item) => item.id !== todoMatch[1]);
    sendJson(response, todos.length === originalLength ? 404 : 204, null);
    return;
  }
    if (todoMatch && request.method === 'DELETE') {
    const originalLength = todos.length;
    todos = todos.filter((item) => item.id !== todoMatch[1]);
    sendJson(response, todos.length === originalLength ? 404 : 204, null);
    return;
  }
  console.log("hey pr5");

  if (request.method === 'GET') serveStatic(request, response);
  else sendJson(response, 404, { error: 'Route not found.' });
});

server.listen(port, () => {
  console.log(`Todo app running at http://localhost:${port}`);
});
