import { motion } from 'framer-motion';

export default function LoginPage() {
  // 개발 환경인지 확인
  const isDevelopment =
    import.meta.env.DEV ||
    import.meta.env.MODE === 'development' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.port === '5173';
  const baseURL = isDevelopment
    ? 'http://localhost:8888'
    : 'https://api.countonme.site';

  const handleNaverLogin = () => {
    window.location.href = `${baseURL}/auth/naver`;
  };

  const handleKakaoLogin = () => {
    window.location.href = `${baseURL}/auth/kakao`;
  };

  const handleGoogleLogin = () => {
    window.location.href = `${baseURL}/auth/google`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-[#fafafa] relative overflow-hidden">
      {/* 로그인 카드 */}
      <motion.div
        className="w-full max-w-2xl z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 로고 섹션 */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <motion.div
            className="mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="src/assets/logo.png"
              alt="Logo"
              className="mx-auto h-32 w-auto"
            />
          </motion.div>
          <motion.p className="text-xl text-gray-600" variants={itemVariants}>
            감도높은 여행의 시작
          </motion.p>
        </motion.div>

        {/* 로그인 카드 */}
        <motion.div
          className="bg-white/90 rounded-3xl shadow-2xl p-12 backdrop-blur-sm"
          variants={itemVariants}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <motion.h2
            className="text-3xl font-semibold text-center text-gray-800 mb-10"
            variants={itemVariants}
          >
            로그인
          </motion.h2>

          {/* 소셜 로그인 버튼들 */}
          <div className="space-y-6">
            <motion.button
              className="w-full py-5 px-8 text-white bg-[#28C840] rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-4"
              onClick={handleNaverLogin}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#28C840] font-bold text-lg">N</span>
              </div>
              <span>네이버로 계속하기</span>
            </motion.button>

            <motion.button
              className="w-full py-5 px-8 text-black bg-[#FEE500] rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-4"
              onClick={handleKakaoLogin}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-[#FEE500] font-bold text-lg">K</span>
              </div>
              <span>카카오로 계속하기</span>
            </motion.button>

            <motion.button
              className="w-full py-5 px-8 text-white bg-[#4285F4] rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-4"
              onClick={handleGoogleLogin}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#4285F4] font-bold text-lg">G</span>
              </div>
              <span>구글로 계속하기</span>
            </motion.button>
          </div>

          {/* 하단 텍스트 */}
          <motion.div
            className="mt-8 text-center text-base text-gray-500"
            variants={itemVariants}
          >
            로그인하면 서비스 이용약관과 개인정보처리방침에 동의하는 것으로
            간주됩니다.
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
