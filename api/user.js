let users = []; // simpan data sementara di memory

export default function handler(req, res) {
  if (req.method === "POST") {
    const { name } = req.body;
    const newUser = { id: users.length + 1, name };
    users.push(newUser);
    res.status(201).json(newUser);
  }
  else if (req.method === "GET") {
    res.status(200).json(users);
  }
  else if (req.method === "PUT") {
    const { id, name } = req.body;
    const user = users.find(u => u.id === id);
    if (user) {
      user.name = name;
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  }
  else if (req.method === "DELETE") {
    const { id } = req.body;
    users = users.filter(u => u.id !== id);
    res.status(200).json({ message: "User deleted" });
  }
  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
