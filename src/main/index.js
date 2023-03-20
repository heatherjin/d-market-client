import React from "react";
import "./index.css";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { API_URL } from "../config/constants.js";
import { Carousel, Button, Pagination } from "antd";
import relativeTime from "dayjs/plugin/relativeTime";
import { SearchOutlined } from "@ant-design/icons";

//fromnow 기능을 사용하기 위해서 extend 해줌
//fromnow機能を使用するためにextendしてくれる
dayjs.extend(relativeTime);

function MainPage() {
  const [products, setProducts] = React.useState([]);
  const [banners, setBanners] = React.useState([]);
  const [search, setSearch]= React.useState("");
  const [totalPages, setTotalPages] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  
  // 검색어가 변경될 때마다 호출
  // 検索ワードが変更されるたびに呼び出し
  const onChangeSearch = (event) => {
    setCurrentPage(1); // 검색어가 변경될 때마다 페이지를 1로 초기화
    setSearch(event.target.value);

  };

  const searchButtonClick = () => {
    axios
      .get(`${API_URL}/products?q=${search}`)
      .then(function (result) {

        const products = result.data.products;
        setProducts(products);
      })
      .catch(function (error) {
        console.error("エラー発生：", error);
      });
  };

  
  const onPageChange = (page) => {
    // ページ番号をアップデート
    // 페이지 번호를 업데이트
    setCurrentPage(page); 
  };

  React.useEffect(function () {
    let apiUrl = `${API_URL}/products`;
    let params = {
      page:currentPage,
      limit: 10,
    };
    if (search) {
      apiUrl += `?q=${search}`;
    }    
    axios
      .get(apiUrl,{params})
      .then(function (result) {
        const products = result.data.products;
        const totalPages = result.data.totalPages;
        setProducts(products);
        setTotalPages(totalPages);
        
      })
      .catch(function (error) {
        console.error("エラー発生：", error);
      });

    axios
      .get(`${API_URL}/banners`)
      .then((result) => {
        const banners = result.data.banners;
        setBanners(banners);
      })
      .catch((err) => {
        console.error("エラー発生：", err);
      });
  }, [search, currentPage]);

  return (
    <div>
      <Carousel autoplay autoplaySpeed={2000}>
        {banners.map((banner, index) => {
          return (            
              <div id="banner">
                <img src={`${API_URL}/${banner.imageUrl}`} />
              </div>
            
          );
        })}
      </Carousel>
      <div id="search">
        <input type="text" value={search} id="search-bar" placeholder="Search Product" onChange={onChangeSearch} />
        <Button type="text" icon={<SearchOutlined />} onClick={searchButtonClick}></Button>
      </div>
      <h2 id="product-headline">販売中の商品</h2>
      <div id="product-list">
        {products.length === 0 ? (
          <div>
            <span>商品がありません。</span>
          </div>
        ) : (
          products.map(function (product, index) {
            return (
              <div className="product-card" key={index}>
                {product.soldout === 1 && <div className="product-blur" />}
                <Link className="product-link" to={`/products/${product.id}`}>
                  <div>
                    <img className="product-img" src={`${API_URL}/${product.imageUrl}`} />
                  </div>
                  <div className="product-contents">
                    <span className="product-name">{product.name}</span>
                    <span className="product-price">￥{`${product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}</span>
                    <div className="product-footer">
                      <div className="product-seller">
                        <img className="product-avatar" src="images/icons/avatar.png" />
                        <span>{product.seller}</span>
                      </div>
                      <span className="product-date">{dayjs(product.createdAt).fromNow()}</span>
                    </div>
                  </div>
                </Link>
              </div>
              
            );
          })
        )}
      </div>
      <div id="pagination">
         <Pagination current={currentPage} onChange={onPageChange} total={totalPages*10} pageSize={10}
         itemRender={(current, type, originalElement) => {
          if (type === "page") {
            return (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 32 }}>
                {originalElement}
              </div>
            );
          }
          return originalElement;
        }} />
      </div>
    </div>
  );
}

export default MainPage;
