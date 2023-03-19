import {
  Form,
  Divider,
  Input,
  InputNumber,
  Button,
  Upload,
  message,
} from "antd";
import { useState } from "react";
import "antd/dist/antd.css"; 
import "./index.css";
import { API_URL } from "../config/constants.js";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { UnorderedListOutlined } from "@ant-design/icons";

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
        // ストリングを数字に変換
        price: parseInt(values.price),
        //useState함수에서 가져옴
        //useState関数から取得
        imageUrl: imageUrl,
        password: values.password,
        phone: values.phone,
      })
      .then((result) => {
        console.log(result);
        // push는 뒤로가기 눌렀을때 해당페이지. replace는 최초페이지로 감
        // pushは後ろへ行くを押したときに該当ページ。 replaceは最初のページに行く
        history.replace("/");
      })
      .catch((err) => {
        console.error(err);
        message.error(`エラーが発生しました。 ${err.message}`);
      });
  };
  const onChangeImage = (info) => {
    if (info.file.status === "uploading") {
      return;
    }
    if (info.file.status === "done") {
      const response = info.file.response;
      const imageUrl = response.imageUrl;
      setImageUrl(imageUrl);
    }
  };
  return (
    
    <div id="upload-container">

      <Form name="商品アップロード" onFinish={onSubmit} >
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
          label={<div className="upload-label">Phone</div>}
          name="phone"
          rules={[
            {
              pattern: /[0-9]{3}-[0-9]{4}-[0-9]{4}/,
              message: "正しい携帯番号形式ではありません。",
            },
            { required: true, message: "携帯番号を入力してください。" },
          ]}
        >
          <Input
            className="upload-name"
            size="middle"
            placeholder="ex)0XX-XXXX-XXXX"
         />
        </Form.Item>
        <Divider />
        <Form.Item
          label={<div className="upload-label">Password</div>}
          name="password"
          rules={[{ required: true, message: "Passwordを入力してください。" }]}
        >
          <Input
            className="upload-name"
            size="middle"
            placeholder="Passwordを入力してください。"
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
