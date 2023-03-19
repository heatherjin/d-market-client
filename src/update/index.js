import {
  Form,
  Divider,
  Input,
  InputNumber,
  Button,
  Upload,
  message,
  Select
} from "antd";
import { useState } from "react";
// Ant Design 스타일시트를 불러옴
// Ant Design スタイルシートを読み込む
import "antd/dist/antd.css"; 
import "./index.css";
import { API_URL } from "../config/constants.js";
import axios from "axios";
// 페이지 이동
// ページ移動
import { useHistory, useLocation  } from "react-router-dom";

function UpdatePage() {
  const [imageUrl, setImageUrl] = useState(null);
  // react hook
  const history = useHistory();
  const location = useLocation();
  const {product} = location.state;
  
  const onSubmit = (values) => {
    axios
     .put(`${API_URL}/products/${product.id}`, {
        name: values.name,
        description: values.description,
        seller: values.seller,
        price: parseInt(values.price),
        //수정되면 수정된값으로, 수정안하면 기존값을 넣음
        //修正されれば修正された値で、修正しなければ既存値を入れる。
        imageUrl: imageUrl !== null ? imageUrl : product.imageUrl,  
        password: values.password,
        phone: values.phone,
        soldout: values.soldout        
      })
      .then((result) => {
        console.log(result);
        history.push(`/products/${product.id}`); 
      })
      .catch((err) => {
        console.error(err);
        message.error(`エラーが発生しました。 ${err.message}`);
      });
  };
  const onChangeImage = (info) => {
    //네트워크 요청이 끝날때 까지의 과정은 업로딩
    //ネットワーク要請が終わるまでの過程はアップローディング
    if (info.file.status === "uploading") {
      return;
    }
    //완료
    //完了
    if (info.file.status === "done") {
      const response = info.file.response;
      const imageUrl = response.imageUrl;
      setImageUrl(imageUrl);
    }
  };
  return (
    
    <div id="upload-container">    
      <Form
        name="商品修正"
        onFinish={onSubmit}
        initialValues={{
        name: product.name,
          description: product.description,
          seller: product.seller,
          price: product.price.toString(),
          password: product.password,
          phone: product.phone,
          imageUrl: product.imageUrl
      }} >

        <Form.Item
          name="upload"
          label={<div className="upload-label">商品写真</div> }
          
        >
          {/* name: key, value의 KEY */}
          <Upload
            name="image"
            action={`${API_URL}/image`}
            listType="picture"            
            showUploadList={false}
            onChange={onChangeImage}
          >
            {imageUrl ? (
              <img id="upload-img" src={`${API_URL}/${imageUrl}`} />
            ) : product.imageUrl ? (
              <img id="upload-img" src={`${API_URL}/${product.imageUrl}`} />
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
          label={<div className="upload-label">取引状況</div>}
          name="soldout"
          rules={[{ required: true, message: "取引状況を確認してください。" }]}
        >
          <Select defaultValue={product.soldout.toString()} style={{ width: '220px' }}>
            <Select.Option value="0">取引中</Select.Option>
            <Select.Option value="1">取引完了</Select.Option>
          </Select>
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
          <Button id="update-button" size="large" htmlType="submit">
            UPDATE
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UpdatePage;
