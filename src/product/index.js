import { useParams } from "react-router-dom";
import "./index.css";
import { API_URL } from "../config/constants.js";
import axios from "axios";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Button, message } from "antd";

function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const getProduct = () => {
    axios
      .get(`${API_URL}/products/${id}`)
      .then(function (result) {
        setProduct(result.data.product);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(function () {
    getProduct();
  }, []);

  if (product === null) {
    return <h1>商品情報をいただいております</h1>;
  }

  const onClickPurchase = () => {
    axios
      .post(`${API_URL}/purchase/${id}`)
      .then((result) => {
        message.info("購入が完了しました。");
        getProduct();
      })
      .catch((err) => {
        message.error(`에러가 발생했습니다. ${err.message}`);
      });
  };

  return (
    <div>
      <div id="image-box">
        <img src={`${API_URL}/${product.imageUrl}`} />
      </div>
      <div id="profile-box">
        <img src={"/images/icons/avatar.png"} />
        <span>{product.seller}</span>
      </div>
      <div id="contents-box">
        <div id="name">{product.name}</div>
        <div id="price">￥{`${product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</div>
        <div id="createdAt">
          {dayjs(product.createdAt).format("YYYY年 MM月 DD日")}
        </div>
        <Button
          id="purchase-button"
          size="large"
          type="primary"
          danger
          onClick={onClickPurchase}
          disabled={product.soldout === 1}
        >
          今すぐ購入する
        </Button>
        <div id="description">{product.description}</div>
      </div>
    </div>
  );
}

export default ProductPage;
