//React 프로젝트에서 쓰이는 다양한 변수 선언, 상수라 대문자로 적음, 한개가 아니라서 defult 안씀
export const API_URL = process.env.NODE_ENV ==='production' ? "https://d-market-server.fly.dev" : "http://localhost:8080";
