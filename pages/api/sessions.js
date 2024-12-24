let sessions = [];
let sessionId = 1;

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { type = 'work', duration = 25 } = req.body;
    const newSession = { id: sessionId++, type, duration: duration * 60 * 1000, status: 'active' };
    sessions.push(newSession);
    res.status(201).json(newSession);
  } else if (req.method === 'GET') {
    res.status(200).json(sessions);
  } else if (req.method === 'DELETE') {
    const { id } = req.query;
    sessions = sessions.filter((session) => session.id !== parseInt(id, 10));
    res.status(204).end();
  } else {
    res.setHeader('Allow', ['POST', 'GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
