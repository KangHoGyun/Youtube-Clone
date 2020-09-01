import React, { useState } from "react";
import { Comment, Avatar } from "antd";
import { useSelector } from "react-redux";
import Axios from "axios";
import LikeDislikes from "./LikeDislikes";

function SingleComment(props) {
  const user = useSelector((state) => state.user);
  const [OpenReply, setOpenReply] = useState(false);
  const [CommentValue, setCommentValue] = useState("");

  const onClickReplyOpen = () => {
    setOpenReply(!OpenReply);
  };

  const onHandleChange = (event) => {
    setCommentValue(event.currentTarget.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const variables = {
      content: CommentValue,
      writer: user.userData._id,
      postId: props.postId,
      // get all comment info from DB for response to
      responseTo: props.comment._id,
    };

    Axios.post("/api/comment/saveComment", variables).then((response) => {
      if (response.data.success) {
        console.log(response.data.result);
        setCommentValue("");
        setOpenReply(false); //대댓글 달고 textarea 안보여주기 위해서
        props.refreshFunction(response.data.result);
      } else {
        alert("코멘트를 저장하지 못 했습니다.");
      }
    });
  };

  const actions = [
    <LikeDislikes
      userId={localStorage.getItem("userId")}
      commentId={props.comment._id}
    />,
    <span onClick={onClickReplyOpen} key="comment-basic-reply-to">
      {" "}
      Reply to{" "}
    </span>,
  ];
  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={<Avatar src={props.comment.writer.image} alt />}
        content={<p> {props.comment.content} </p>}
      ></Comment>

      {OpenReply && (
        <form style={{ display: "flex" }} onSubmit={onSubmit}>
          <textarea
            style={{ width: "100%", borderRadius: "5px", marginRight: "1rem" }}
            onChange={onHandleChange}
            value={CommentValue}
            placeholder="Please write your comment"
          />
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
      )}
    </div>
  );
}

export default SingleComment;
