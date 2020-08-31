import React, { useEffect, useState } from "react";
import { Row, Col, List, Avatar } from "antd";
import Axios from "axios";
import SideVideo from "./Section/SideVideo";
import Subscribe from "./Section/Subscribe";

function VideoDetailPage(props) {
  const videoId = props.match.params.videoId;
  const videoVariable = { videoId: videoId };

  const [Video, setVideo] = useState([]);
  useEffect(() => {
    Axios.post("/api/video/getVideo", videoVariable).then((response) => {
      if (response.data.success) {
        setVideo(response.data.video);
      } else {
        alert("비디오 정보를 가져오기를 실패했습니다.");
      }
    });
  }, []);

  if (Video.writer) {
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
                <Subscribe
                  userTo={Video.writer._id}
                  userfrom={localStorage.getItem("userId")}
                />,
              ]} /*여기다 쓰면 너무 길어져서 component를 따로 만들어 관리 */
            >
              <List.Item.Meta
                avatar={<Avatar src={Video.writer.image} />}
                title={Video.writer.name}
                description={Video.description}
              />
            </List.Item>

            {/* Comments */}
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
