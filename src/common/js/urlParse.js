export default function urlParse(name) {
  var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
  let url = window.location.href;
  let result = url.match(/(.*)(\#\/)$/);
  if ( result ) {
    url = decodeURIComponent(result[1]);
  } else {
    url = decodeURIComponent(url);
  }
  if (reg.test(url)) return unescape(RegExp.$2.replace(/\+/g, ''));
  return '';
}
