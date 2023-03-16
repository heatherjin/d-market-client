import { useParams,useHistory } from "react-router-dom";
import "./index.css";
import { API_URL } from "../config/constants.js";
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Button, Input, message, Modal } from "antd";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [visible, setVisible] = useState(false);



  const getProduct = () => {
    axios
      .get(`${API_URL}/products/${id}`)
      .then(function (result) {
        setProduct(result.data.product);
        setPassword(result.data.product.password);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(function () {  //최초한번만 실행되게 함.
    getProduct();
  }, []);


  if (product === null) {
    return <h1>商品情報をいただいております</h1>;
  }

  const onClickPurchase = () => {
    axios
      .post(`${API_URL}/purchase/${id}`)
      .then((result) => {
        message.info("取引が完了しました。");
        getProduct();
        
      })
      .catch((err) => {
        message.error(`에러가 발생했습니다. ${err.message}`);
      });   
  };

  const handlePasswordInputChange = (e) => {
    setPasswordInput(e.target.value);
  };


  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    if (passwordInput === password) {
      console.log('取引が完了しました。');
      onClickPurchase();
      setVisible(false);
    } else {
      message.error('パスワードが一致しません。', 2);
    }
  };

  const handleOkDelete = () => {
    if (passwordInput === password) {
      // 삭제 처리 로직 수행
      axios
        .delete(`${API_URL}/purchase/${id}`)
        .then((response)=>{
          setVisible(false);
          message.info("取引が完了しました。");
        }).catch((err) => {
          message.error(`에러가 발생했습니다. ${err.message}`);
        });  
      } else {
        message.error('パスワードが一致しません。', 2);
      }
    };

  const handleCancel = () => {
    setVisible(false);
  };


  return (
    <div>
      <div id="image-box">
        <img src={`${API_URL}/${product.imageUrl}`} />
      </div>
      <div id="profile-box">
        <img src={"/images/icons/avatar.png"} />
        <span>{product.seller}</span><span>{product.phone}</span>
      </div>
      <div id="contents-box">
        <div id="name">{product.name}</div>
        <div id="price">￥{`${product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</div>
        <div id="createdAt">
          {dayjs(product.createdAt).format("YYYY年 MM月 DD日")}
        </div>

        <div>
          <Button
            id="purchase-button"
            size="large"
            type="primary"
            danger
            onClick={showModal}
            disabled={product.soldout === 1}
          >
            取引確定する
          </Button>
          {/* 비밀번호 확인 모달창 */}
          <Modal
            title="パスワード確認"
            visible={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnClose={true} 
          >
            <Input.Password placeholder="パスワードをご入力ください。" onChange={handlePasswordInputChange} />
          </Modal>
        </div>
        <div id="description">{product.description}</div>
        <div>
          
          <Button onClick={showModal}>삭제</Button> <div>{password}</div>
          
      
       </div>
      </div>
    </div>
  );
}

export default ProductPage;
