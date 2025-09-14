import Header from "../components/Header";
import LoadingSpinner from "../components/loadingSpinner";

export default function LoadingPage() {
  return(
    <div>
      <Header />
      <LoadingSpinner message="로딩 중입니다."/>
    </div>
  )
}