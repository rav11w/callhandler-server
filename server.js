const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

let latestMessage = null;
let lastSentMessage = null;

app.use(cors());
app.use(express.json());

app.post("/messages", (req, res) => {
  const message = req.body?.content || "";
  console.log("[Discord] Message received:\n" + message);
  latestMessage = message;
  res.sendStatus(200);
});

app.get("/messages", (req, res) => {
  if (!latestMessage || latestMessage === lastSentMessage) {
    return res.json({}); // Avoid sending duplicate or empty data
  }

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
    lastSentMessage = latestMessage;
    res.json(data);
  } else {
    res.json({});
  }
});
 
app.listen(port, () => {
  console.log(`✅ CallHandler API running on port ${port}`);
});
