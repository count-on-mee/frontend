import { useResetRecoilState } from "recoil";
import authAtom from "../recoil/auth";
import userAtom from "../recoil/user";
import scrapStateAtom from "../recoil/scrapState";
import selectedSpotAtom from "../recoil/selectedSpot/atom";
import selectedCurationAtom from "../recoil/selectedCuration";
import curationsAtom from "../recoil/curations";

export const useResetUserAtoms = () => {
  const resetAuth = useResetRecoilState(authAtom);
  const resetUser = useResetRecoilState(userAtom);
  const resetSpotScrap = useResetRecoilState(scrapStateAtom);
  const resetSelectedSpot = useResetRecoilState(selectedSpotAtom);
  const resetSelectedCuration = useResetRecoilState(selectedCurationAtom);
  const resetCurations = useResetRecoilState(curationsAtom);
  
  return () => {
    resetAuth();
    resetUser();
    resetSpotScrap();
    resetSelectedSpot();
    resetSelectedCuration();
    resetCurations();
  }
}