function betweenRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  
module.exports=generateOtp = () => {
    return betweenRandomNumber(100000, 999999);
};