//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash")
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

dotenv.config({ path: `${__dirname}/.env` });
let posts = [];

const databaseConnection = () => {
  mongoose.set('strictQuery', false);
  mongoose.connect(process.env.MONGO_URL).then((data) => {
    console.log('Database connected')
  });
};

databaseConnection();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const articleSchema = {
  topic: String,
  content: String
};

const Article = mongoose.model("Articles", articleSchema);

// for multiple posts

app.route("/articles")
  .get(async (req, res) => {
    try {
      posts = await Article.find();
      res.send(posts);
    } catch (err) {
      clg(err);
    }
  })
  .post(async (req, res) => {

    const article = new Article({
      topic: req.body.topic,
      content: req.body.content
    });

    try {
      const result = await article.save();
      res.send("Saved Successfully");
    } catch (err) {
      console.log(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const result = await Article.deleteMany();
      res.send("All articles Deleted Successfully");
    } catch (err) {
      console.log(err);
    }
  });


// for single posts
app.route("/articles/:articleTitle")
  .get(async (req, res) => {
    const keyword = req.params.articleTitle;
    try {
      res.send(await Article.find({ topic: keyword }));
    } catch (err) {
      console.log(err)
    };
  })
  .put(async(req, res) => {
    try {
     await Article.replaceOne(
       {topic: req.params.articleTitle}, {topic: req.body.topic, content: req.body.content}
      );
      res.send("Updated Successfully")
    }catch(err){
      console.log(err);
    }
  })
  .delete(async(req,res)=>{
    try{
      await Article.deleteOne({topic: req.params.articleTitle});
      res.send("Article deleted successfully");
    }catch(err){
      console.log(err);
    }
  });


app.listen(process.env.PORT, function () {
  console.log(`Server started on port: ${process.env.PORT}`);
});
