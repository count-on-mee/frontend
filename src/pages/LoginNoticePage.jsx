import { useNavigate } from 'react-router-dom';
import { styleUtils, neumorphStyles } from '../utils/style';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import iconImage from '../assets/logo.png';

export default function LoginNoticePage() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-background opacity-70 backdrop-filter backdrop-blur-xl"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div
            className={clsx(
              neumorphStyles.base,
              neumorphStyles.hover,
              'rounded-2xl p-8 flex flex-col items-center text-center space-y-8',
            )}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="relative w-48 h-48 mb-8"
            >
              <div className="absolute inset-0 bg-[var(--color-primary)]/10 rounded-full blur-2xl"></div>
              <img
                src={iconImage}
                alt="로그인 필요"
                className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-[#252422]">
                로그인이 필요합니다
              </h2>
              <p className="text-[#252422]/70">
                스크랩한 장소와 큐레이션을 보려면 로그인해주세요.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="w-full space-y-4 pt-4"
            >
              <button
                onClick={() => navigate('/login')}
                className={clsx(
                  styleUtils.buttonStyle('primary', false, 'lg'),
                  'w-full',
                )}
              >
                로그인하기
              </button>
              <button
                onClick={() => navigate('/')}
                className={clsx(
                  styleUtils.buttonStyle(false, false, 'lg'),
                  'w-full',
                )}
              >
                홈으로 돌아가기
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
