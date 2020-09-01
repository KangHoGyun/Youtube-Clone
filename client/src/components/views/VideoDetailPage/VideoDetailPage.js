import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import Axios from "axios";
import SideVideo from "./Section/SideVideo";
import Subscriber from "./Section/Subscriber";
import Comment from "./Section/Comment";
import LikeDislikes from "./Section/LikeDislikes";

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const videoVariable = { videoId: videoId };

  const [Video, setVideo] = useState([]);
  const [Comments, setComments] = useState([]);
  useEffect(() => {
    Axios.post("/api/video/getVideo", videoVariable).then((response) => {
      if (response.data.success) {
        setVideo(response.data.video);
      } else {
        alert("비디오 정보를 가져오기를 실패했습니다.");
      }
    });

    Axios.post("/api/comment/getComments", videoVariable).then((response) => {
      //이 비디오 아이디에 해당하는 모든 코멘트들을 가져오려고 variable 똑같이
      if (response.data.success) {
        setComments(response.data.comments);
        console.log(response.data.comments);
      } else {
        alert("코멘트 정보를 가져오는 것을 실패하였습니다.");
      }
    });
  }, []);

  const refreshFunction = (newComment) => {
    setComments(Comments.concat(newComment));
  }; //새로운 코멘트 자식, 손주 받아와서 업데이트해주기

  if (Video.writer) {
    const subscribeButton = Video.writer._id !==
      localStorage.getItem("userId") && (
      <Subscriber
        userTo={Video.writer._id}
        userFrom={localStorage.getItem("userId")}
      /> /*자신의 계정이 자신의 동영상에는 구독 버튼이 안 뜨게*/
    );
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
            <video
              style={{ width: "100%" }}
              src={`http://localhost:5000/${Video.filePath}`}
              controls
            ></video>

            <List.Item
              actions={[
                <LikeDislikes
                  video
                  userId={localStorage.getItem("userId")}
                  videoId={videoId}
                />, //video에 대한 좋아요이므로 props로 video를 넣어준다.
                subscribeButton,
              ]} /*여기다 쓰면 너무 길어져서 component를 따로 만들어 관리 */
            >
              <List.Item.Meta
                avatar={<Avatar src={Video.writer.image} />}
                title={Video.writer.name}
                description={Video.description}
              ></List.Item.Meta>
            </List.Item>

            {/* Comments */}
            <Comment
              refreshFunction={refreshFunction}
              commentList={Comments}
              postId={videoId}
            />
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo />
        </Col>
      </Row>
    );
  } else {
    return <div> ...loading...</div>;
  }
}
export default VideoDetailPage;
