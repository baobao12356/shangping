
export default function backOrient() {
  console.log('backOrient-----------');
  if ( window.location.protocol != 'file:' ) {
    return 'back=h5';
  } else {
    return 'back=file';
  }
}
