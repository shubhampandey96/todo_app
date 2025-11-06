const express = require("express");
const { getTodos, addTodo } = require("../controllers/todoController"); // ✅ fixed spelling

const router = express.Router();

router.get("/get-todos", getTodos);

router.post("/add-todo", addTodo);

router.get("/health", (req, res) => {
  try {
    return res.status(200).json({ msg: "Healthy" });
  } catch (err) {
    return res.status(500).json({ msg: "Unhealthy" });
  }
});

// router.post("/update-todo", updateTodo);

// Todo: Implement the logic for handling deletion of todos
// router.delete("/:id",);

module.exports = router;
