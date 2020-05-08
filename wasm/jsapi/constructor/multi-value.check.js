(async() => {
try {
  let arr =[0,97,115,109,1,0,0,0,1,12,2,96,2,125,127,2,127,125,96,0,1,127,3,3,2,0,1,7,12,1,8,99,97,108,108,115,119,97,112,0,1,10,27,2,7,0,32,1,32,0,15,11,17,0,67,102,102,134,64,65,135,128,128,128,0,16,0,26,15,11,0,22,4,110,97,109,101,2,4,115,119,97,112,0,8,99,97,108,108,115,119,97,112,0]
  let buffer = Uint8Array.from(arr);
  console.log(buffer);
  const result = await WebAssembly.instantiate(buffer);
  console.log(result);
  const swapped = result.instance.exports.callswap();
  console.log(swapped);
} catch (e) {
  console.log(e)
}

})()
