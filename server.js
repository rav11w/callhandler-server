const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

let latestMessage = null;

app.use(express.json());

app.post("/messages", (req, res) => {
  const message = req.body?.content || "";
  latestMessage = message;
  res.sendStatus(200);
});

app.get("/messages", (req, res) => {
  if (latestMessage) {
    const lines = latestMessage.split("\n");
    const data = {};

    for (const line of lines) {
      const [key, ...valueParts] = line.split(":");
      const value = valueParts.join(":").trim();
      if (key && valueParts.length > 0) {
        const lowerKey = key.trim().toLowerCase();
        if (lowerKey === "call description") data.description = value;
        if (lowerKey === "which agency is required") data.agency = value;
        if (lowerKey === "address") data.address = value;
      }
    }

    if (data.description && data.agency && data.address) {
      res.json(data);
    } else {
      res.json({}); // Invalid or incomplete message
    }

    latestMessage = null; // Clear after sending
  } else {
    res.json({});
  }
});

app.listen(port, () => {
  console.log(`CallHandler API running on port ${port}`);
});
