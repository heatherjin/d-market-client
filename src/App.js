import "antd/dist/antd.css";
import "./App.css";
import MainPageComponent from "./main";
import { Switch, Route, Link, useHistory } from "react-router-dom";
import UploadPage from "./upload";
import ProductPage from "./product";
import UpdatePage from "./update";
import { Button, Select } from "antd";
import { DownloadOutlined} from "@ant-design/icons";


function App() {
  const history = useHistory();
  const { Option } = Select;

  return (
    <div>
      <div id="header">
        <div id="header-area">
          <Link to="/">
            <img src="/images/icons/logo.png" />
          </Link>
       
            <Button
              size="large"
              onClick={function () {
                history.push("/upload");
              }}
              icon={<DownloadOutlined />}
            >
              PRODUCT UPLOAD
            </Button>
    
        </div>
      </div>
      <div id="body">
        <Switch>
          <Route exact={true} path="/">
            <MainPageComponent />
          </Route>
          <Route exact={true} path="/products/:id">
            <ProductPage />
          </Route>
          <Route exact={true} path="/upload">
            <UploadPage />
          </Route>
          <Route exact={true} path="/update/:id">
           <UpdatePage />
          </Route>
        </Switch>
      </div>
      <div id="footer"> 
        <p>Copyright © 2023 D-Market</p>
        <p>
          <a href="#">About</a> -
          <a href="#">Privacy Policy</a> -
          <a href="#">Contact Us</a>
        </p>
      </div>
    </div>
  );
}

export default App;
