export default function LoginPage() {
  const handleNaverLogin = async () => {
    window.location.href = 'https://countonme.site/auth/naver';
  };

  const handleKakaoLogin = () => {
    window.location.href = 'https://countonme.site/auth/kakao';
  };

  const handleGoogleLogin = () => {
    window.location.href = 'https://countonme.site/auth/google';
  };

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center bg-background-light">
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-10">
          <img src="src/assets/logo.png" alt="Logo" />
        </h1>
        <button
          className="mb-4 w-1/4 py-2 text-white bg-[#28C840] rounded-full "
          onClick={handleNaverLogin}
        >
          네이버 로그인
        </button>
        <button
          className="mb-4 w-1/4 py-2 text-black bg-[#FEE500] rounded-full "
          onClick={handleKakaoLogin}
        >
          카카오 로그인
        </button>
        <button
          className="mb-4 w-1/4 py-2 text-white bg-[#4285F4]  rounded-full"
          onClick={handleGoogleLogin}
        >
          구글 로그인
        </button>
        <div className="w-full mt-10 fixed bottom-0"></div>
      </div>
    </>
  );
}
