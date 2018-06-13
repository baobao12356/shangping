/*width
*height
* mark: 是否要水印
* pos: x/@
* */
export default function resizeImg(img, width, height, mark = '!', pos = 'x') {
  const dpr = window.devicePixelRatio.toFixed(1);
  const _width = Math.ceil((width / 2) * dpr);
  const _height = Math.ceil((height / 2) * dpr);
  return `${img}.${_width}${pos}${_height}.jpg${mark}`;
}
