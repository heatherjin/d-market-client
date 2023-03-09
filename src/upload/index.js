import {
  Form,
  Divider,
  Input,
  InputNumber,
  Button,
  Upload,
  message,
} from "antd";
import { ForkOutlined } from "@ant-design/icons";
import { useState } from "react";
import "./index.css";
import { API_URL } from "../config/constants.js";
import axios from "axios";
// 페이지 이동
import { useHistory } from "react-router-dom";

function UploadPage() {
  const [imageUrl, setImageUrl] = useState(null);
  // react hook
  const history = useHistory();
  const onSubmit = (values) => {
    axios
      .post(`${API_URL}/products`, {
        name: values.name,
        description: values.description,
        seller: values.seller,
        // 스트링을 숫자로 변환
        price: parseInt(values.price),
        //useState함수에서 가져옴
        imageUrl: imageUrl,
      })
      .then((result) => {
        console.log(result);
        // push는 뒤로가기 눌렀을때 해당페이지. replace는 최초페이지로 감
        history.replace("/");
      })
      .catch((err) => {
        console.error(err);
        message.error(`에러가 발생했습니다. ${err.message}`);
      });
  };
  const onChangeImage = (info) => {
    //네트워크 요청이 끝날때 까지의 과정은 업로딩
    if (info.file.status === "uploading") {
      return;
    }
    //완료
    if (info.file.status === "done") {
      const response = info.file.response;
      const imageUrl = response.imageUrl;
      setImageUrl(imageUrl);
    }
  };
  return (
    <div id="upload-container">
      <Form name="상품 업로드" onFinish={onSubmit}>
        <Form.Item
          name="upload"
          label={<div className="upload-label">商品写真</div>}
        >
          {/* name: key, value의 KEY */}
          <Upload
            name="image"
            action={`${API_URL}/image`}
            listType="picture"
            //
            showUploadList={false}
            onChange={onChangeImage}
          >
            {imageUrl ? (
              <img id="upload-img" src={`${API_URL}/${imageUrl}`} />
            ) : (
              <div id="upload-img-placeholder">
                <img src="/images/icons/camera.png" />
                <span>写真をアップロード<br/>してください。</span>
              </div>
            )}
          </Upload>
        </Form.Item>
        <Divider />
        <Form.Item
          label={<div className="upload-label">販売者</div>}
          name="seller"
          rules={[{ required: true, message: "販売者を入力してください。" }]}
        >
          <Input
            className="upload-name"
            size="middle"
            placeholder="名前を入力してください。"
          />
        </Form.Item>
        <Divider />
        <Form.Item
          name="name"
          label={<div className="upload-label">商品名</div>}
          rules={[{ required: true, message: "商品名を入力してください。" }]}
        >
          <Input
            className="upload-name"
            size="middle"
            placeholder="商品名を入力してください。"
          />
        </Form.Item>
        <Divider />
        <Form.Item
          name="price"
          label={<div className="upload-label">商品価格</div>}
          rules={[{ required: true, message: "商品価格を入力してください。" }]}
        >
          <InputNumber defaultValue={0} className="upload-price" size="middle" />
        </Form.Item>
        <Form.Item
          name="description"
          label={<div className="upload-label">商品紹介</div>}
          rules={[{ required: true, message: "商品紹介を入力してください。" }]}
        >
          <Input.TextArea
            size="large"
            id="product-description"
            showCount={true}
            maxLength={300}
            placeholder="商品紹介を書いてください。"
          />
        </Form.Item>
        <Form.Item>
          <Button id="submit-button" size="large" htmlType="submit">
            商品登録
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UploadPage;
