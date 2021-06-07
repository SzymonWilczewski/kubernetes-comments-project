import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [mongoComments, setMongoComments] = useState([]);
  const [redisComments, setRedisComments] = useState([]);

  const [mongoComment, setMongoComment] = useState("");
  const [redisComment, setRedisComment] = useState("");

  useEffect(() => {
    getData();
    setInterval(getData, 5000);
  }, []);

  const getData = () => {
    axios
      .get("/api/mongo/comments")
      .then((res) => setMongoComments(res.data))
      .catch((err) => console.log(err));
    axios
      .get("/api/redis/comments")
      .then((res) => setRedisComments(res.data))
      .catch((err) => console.log(err));
  };

  const handleMongoSubmit = (e) => {
    e.preventDefault();
    setMongoComment("");
    axios
      .post("/api/mongo/comment", { title: mongoComment })
      .then((res) => setMongoComments([...mongoComments, res.data]))
      .catch((err) => console.log(err));
  };

  const handleRedisSubmit = (e) => {
    e.preventDefault();
    setRedisComment("");
    axios
      .post("/api/redis/comment", { title: redisComment })
      .then((res) => setRedisComments([...redisComments, res.data]))
      .catch((err) => console.log(err));
  };

  const handleMongoDelete = (id) =>
    axios
      .delete(`/api/mongo/comment/${id}`)
      .then(() =>
        setMongoComments(mongoComments.filter((comment) => comment._id !== id))
      )
      .catch((err) => console.log(err));

  const handleRedisDelete = (id) =>
    axios
      .delete(`/api/redis/comment/${id}`)
      .then(() =>
        setRedisComments(redisComments.filter((comment) => comment.id !== id))
      )
      .catch((err) => console.log(err));

  return (
    <div className="App">
      <div className="Mongo">
        <h1>MONGO</h1>
        <div>
          <form onSubmit={handleMongoSubmit}>
            <input
              placeholder="Comment"
              onChange={(e) => setMongoComment(e.target.value)}
              value={mongoComment}
            ></input>
            <button type="submit">Add</button>
          </form>
          <br />
          <div>
            {mongoComments.map((comment) => (
              <div>
                <div className="Comment" key={comment._id}>
                  {comment.title}
                  <button onClick={() => handleMongoDelete(comment._id)}>
                    Delete
                  </button>
                </div>
                <br />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="Redis">
        <h1>REDIS</h1>
        <div>
          <form onSubmit={handleRedisSubmit}>
            <input
              placeholder="Comment"
              onChange={(e) => setRedisComment(e.target.value)}
              value={redisComment}
            ></input>
            <button type="submit">Add</button>
          </form>
          <br />
          <div>
            {redisComments.map((comment) => (
              <div>
                <div className="Comment" key={comment.id}>
                  {comment.title}
                  <button onClick={() => handleRedisDelete(comment.id)}>
                    Delete
                  </button>
                </div>
                <br />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ position: "fixed", bottom: 8, left: 8, color: "gray" }}>
        Dev-1.0
      </div>
    </div>
  );
}

export default App;
