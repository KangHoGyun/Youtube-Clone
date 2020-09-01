import React, { useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

function Comment(props) {
  const user = useSelector((state) => state.user);
  const videoId = props.postId;
  const [commentValue, setcommentValue] = useState("");

  const handleChange = (event) => {
    setcommentValue(event.currentTarget.value);
  };

  const onSubmit = (event) => {
    event.preventDefault(); //이걸 해줌으로써 submit을 눌러도 refresh 되지 않게 해준다. 디폴트는 refresh

    const variables = {
      content: commentValue,
      // user from redux
      writer: user.userData._id,
      postId: videoId,
    };

    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        setcommentValue(""); //이렇게 해줘야 submit 하고도 textArea에 아무것도 안 남는다.
        props.refreshFunction(response.data.result);
      } else {
        alert("코멘트를 저장하지 못 했습니다.");
      }
    });
  };

  return (
    <div>
      <br />
      <p> Replies</p>
      <hr />

      {/* Comment Lists */}

      {props.commentLists &&
        props.commentLists.map(
          (
            comment,
            index // { } 이걸 쓰려면 리턴! () => 이런 곳에서 그러는듯
          ) =>
            !comment.responseTo && ( // react에선 jsx를 사용하는데, div나 react.fragment로 감싸줘야 한다.
              <React.Fragment>
                <SingleComment
                  key={index}
                  refreshFunction={props.refreshFunction}
                  comment={comment}
                  postId={videoId}
                />
                <ReplyComment
                  refreshFunction={props.refreshFunction}
                  parentCommentId={comment._id}
                  postId={videoId}
                  commentLists={props.commentLists}
                />
              </React.Fragment>
            )
        )}

      {/* Root Comment Form */}

      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <textarea
          style={{ width: "100%", borderRadius: "5px", marginRight: "1rem" }}
          onChange={handleChange} //이게 없으면 아무리 타이핑을 해도 글씨가 써지지 않는다.
          value={commentValue}
          placeholder="Please write yout comment."
        ></textarea>
        <br />
        <button
          style={{
            width: "20%",
            height: "52px",
            background: "lightgray",
            color: "white",
            borderRadius: "5px",
          }}
          onClick={onSubmit}
        >
          Reply
        </button>
      </form>
    </div>
  );
}

export default Comment;
