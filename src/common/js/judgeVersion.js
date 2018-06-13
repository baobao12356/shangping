/*
* 判断版本号
* @param
* nowVer -- 当前版本 'x.x.x'
* standardVer -- 基准版本 'x.x.x'
* judgeType -- 判断类型：0 当前版本小于基准版本，1 当前版本大于基准版本
* */
export default function judgeVersion(nowVer, standardVer) {
  let nowVerArr = nowVer.split('.');
  let standardVerArr = standardVer.split('.');

  for (let i = 0; i < 3; i++) {
    if (parseInt(nowVerArr[i]) > parseInt(standardVerArr[i])) {
      return true;
    }
  }

  return false;
}
