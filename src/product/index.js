import { useParams,useHistory,Link } from "react-router-dom";
import "./index.css";
import { API_URL } from "../config/constants.js";
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Button, Input, message, Modal } from "antd";
import { DeleteOutlined, UnorderedListOutlined, EditOutlined } from "@ant-design/icons";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const history = useHistory(); 


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

  useEffect(function () {  
    //최초한번만 실행되게 함.
    //最初の一度だけ実行されるようにする。
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
        message.error(`エラーが発生しました。 ${err.message}`);
      });   
  };

  const handlePasswordInputChange = (e) => {
    setPasswordInput(e.target.value);
  };


  const showModal1 = () => {
    setVisible1(true);
  };

  const showModal2 = () => {
    setVisible2(true);
  };

  const showModal3 = () => {
    setVisible3(true);
  };

  const handleOk = () => {
    if (passwordInput === password) {
      console.log('取引が完了しました。');
      onClickPurchase();
      setVisible1(false);
    } else {
      message.error('パスワードが一致しません。', 2);
    }
  };


  const handleOkUpload= () => {
    if (passwordInput === password) {
      history.push({
        // 수정할 상품의 id 값을 포함한 경로로 이동
        // 修正する商品のid値を含む経路に移動
        pathname: `/update/${product.id}`, 
        state: { product },
      });
    } else {
      message.error('パスワードが一致しません。');
    }
  };

  const handleOkDelete = () => {
    if (passwordInput === password) {
      axios
        .delete(`${API_URL}/products/${id}`)
        .then((response)=>{
          setVisible3(false);
          message.info("削除が完了しました。");
          // 삭제 성공 후 상품 목록 페이지로 이동
          // 削除成功後、商品リストページに移動
          history.push("/");
        }).catch((err) => {
          message.error(`エラーが発生しました。 ${err.message}`);
        });  
      } else {
        message.error('パスワードが一致しません。', 2);
      }
    };



  const handleCancel1 = () => {
    setVisible1(false);
  };

  const handleCancel2 = () => {
    setVisible2(false);
  };

  const handleCancel3 = () => {
    setVisible3(false);
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
            onClick={showModal1}
            disabled={product.soldout === 1}
          >
            取引確定する
          </Button>
          <Modal
            title="パスワード確認"
            visible={visible1}
            onOk={handleOk}
            onCancel={handleCancel1}
            destroyOnClose={true} 
          >
            <Input.Password placeholder="パスワードをご入力ください。" onChange={handlePasswordInputChange} />
          </Modal>
        </div>
        <div id="description">{product.description}</div>
        <div id="product-info-button">
          <div>          
            <Button          
            onClick={showModal2}
            id="upload-button"
            icon={<EditOutlined />}
            >UPDATE</Button> 
            <Modal
              title="パスワード確認"
              visible={visible2}
              onOk={handleOkUpload}
              onCancel={handleCancel2}
              destroyOnClose={true}
            >
              <Input.Password placeholder="パスワードをご入力ください。" onChange={handlePasswordInputChange} />
            </Modal>      
         </div>
         <div>          
            <Button          
            onClick={showModal3}
            id="delete-button"
            icon={<DeleteOutlined />}
            >DELETE</Button> 
            <Modal
              title="パスワード確認"
              visible={visible3}
              onOk={handleOkDelete}
              onCancel={handleCancel3}
              destroyOnClose={true}
            >
              <Input.Password placeholder="パスワードをご入力ください。" onChange={handlePasswordInputChange} />
            </Modal>      
          </div>
          <div>
            <Link to="/" >
              <Button id="return-button" icon={<UnorderedListOutlined />}>LIST</Button>
            </Link>
          </div>          
       </div>
      </div>
    </div>
  );
}

export default ProductPage;



