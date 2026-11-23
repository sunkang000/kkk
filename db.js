/* =========================================================
   db.js - Supabase 연결 (연결 코드는 이 파일 한 곳에만 둡니다)
   불러오는 순서: supabase-js(CDN) → db.js → script.js
   ※ 공개용 Publishable key 만 씁니다. Secret key · DB 비밀번호는 절대 넣지 않습니다.
   ========================================================= */
const SUPABASE_URL = "https://jhbdhjimybyhwsadljbu.supabase.co";
const SUPABASE_KEY = "sb_publishable_mt-cR2rQETP1nivg9b_Usw_jVyS38ws";

/* 연결 변수: db (다음 단계부터 script.js 에서 db.from("shop_products") 처럼 씁니다) */
const db = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

/* 페이지가 열리면 shop_products 상품 수를 세어 콘솔에 찍기 */
async function checkConnection() {
  if (!db) {
    console.error("연결 실패: supabase-js 를 불러오지 못했습니다. 인터넷 연결과 CDN 주소를 확인하세요.");
    return;
  }
  try {
    const { count, error } = await db
      .from("shop_products")
      .select("*", { count: "exact", head: true });
    if (error) {
      console.error("연결 실패:", error.message);
      return;
    }
    console.log(`연결 성공: 상품 ${count}개`);
  } catch (err) {
    console.error("연결 실패:", err.message);
  }
}

checkConnection();
