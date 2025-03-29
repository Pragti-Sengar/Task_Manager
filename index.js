import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "Pragti@123",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [ ];

app.get("/",async (req, res) => {
  try {
    const result=await db.query("SELECT * FROM items ORDER BY id ASC");
    items=result.rows;
    res.render("index.ejs",{
      listTitle:"List Your Daliy Targets",
      listItems:items,
    });
  }catch(err){
    console.log(err);
   }
  });
  app.post("/add", async (req, res) => {
    const { newItem, due_date, priority } = req.body;
    if (!newItem) {
      return res.status(400).send("Task title is required");
    }
    try {
      await db.query(
        "INSERT INTO items (title, due_date, priority) VALUES ($1, $2, $3)",
        [newItem, due_date || null, priority || "Medium"]
      );
      res.redirect("/");
    } catch (err) {
      console.log("Error inserting due date:", err);
    }
  });
  



app.post("/edit",async (req, res) => {
  const item=req.body.updatedItemTitle;
  const id = req.body.updatedItemId;

  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = $2",[item,id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
app.post("/update-status",async (req, res) => {
  
  const {status, id}=req.body;
  

  try {
    await db.query("UPDATE items SET status = ($1) WHERE id = $2",[status,parseInt(id, 10)]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});



app.post("/delete", async(req, res) => {
  const id=req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err)
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
 
