var sz = require('./sz.js');

/*
function getDoc(startIndex, endIndex) {
  for (var i = startIndex; i <=endIndex; ++i) {
    var stockCode = i.toString();
    var size = stockCode.length;
    for (var z = 0; z < 6 - size; ++z) {
      stockCode = "0" + stockCode;
    }
    //console.log(stockCode);
    callSZ(stockCode);
  }
}


function callSZ(stockCode) {
  var keyword = "董事会";
  sz.getSZ(stockCode, keyword, '', '', '');
  keyword = "董事局";
  sz.getSZ(stockCode, keyword, '', '', '');
}
*/

function getDoc(index) {
    var stockCode = index.toString();
    var size = stockCode.length;
    for (var z = 0; z < 6 - size; ++z) {
      stockCode = "0" + stockCode;
    }

    function continueNext(var1, keyword){
      sz(stockCode, keyword, '','','');
    };

    var res = sz(stockCode, "董事会", '','','');
    continueNext(res, "董事局");
}


function search(startIndex, endIndex) {
  getDoc(startIndex);
  var n = startIndex + 1;
  setInterval(function(){
    if (n <= endIndex) {
      getDoc(n++);
    }
  }, 15000);
}


/*
function search(startIndex, endIndex) {

  function continueNext(var1, index) {
    res = getDoc(index + 1);
    return res;
  }
  var res = '';
  for(var i = startIndex; i < endIndex; ++i) {
      var res1 = continueNext(res, i);
      res = res1;
  }
}
*/

function search1(callback) {
  var res = search(1,900);
  callback(res);
}

function search2(callback) {
  var res = search1(function(res){
    search(2001,2815);
  });
  callback(res);
}

search2(function(res){
  search(300001,300555);
});


/*
function search3(function search2(res){
  search(300001, 300555);
}){
  var res = function search1(function search0(res_1) {
    search(2001,2815);
  }){
    var res_1 = search(1, 900);
    search0(res_1);
  }();
  search2(res);
}();
*/

//每次运行一行，运行前用 “//” 将前一次的comment out

//search(1,900);
//getDoc(1696);
//getDoc(1896);
//getDoc(1979);
//search(2001, 2815);
//search(300001, 300555);
