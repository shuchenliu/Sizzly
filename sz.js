var fs = require('fs');
var path = require('path');
var request = require('request');
var qs = require('querystring');
var cheerio = require('cheerio');
var urlencode = require('urlencode');
var iconv = require('iconv-lite');


var handler = function getSZ(code, inputKeyword, docType, startDate, endDate) {
       function getEndDate() {
         var today = new Date();
         var dd = today.getDate();
         var mm = today.getMonth() + 1;
         var yy = today.getFullYear();

         dd = dd < 10 ? '0' + dd : dd;
         mm = mm < 10 ? '0' + mm : mm;
         var formattedDate = yy +'-'+ mm + '-' + dd;
         return formattedDate;
       }


       if (startDate == '') {
         startDate = "2001-01-01";
       }
       if (endDate == '') {
         endDate = getEndDate();
         //endDate = "2016-12-31";
       }
       var keyword = urlencode(inputKeyword,'gbk');

        //date has to be in yyyy-mm-dd format
       var form = {
         leftid:'1',
         lmid:'drgg',
         pageNo:'1',
         stockCode:code,
         'keyword': 'placeholder',
         noticeType: docType,
         startTime: startDate,
         endTime: endDate,
         'imageField.x':'33',
         'imageField.y':'10',
         tzy:'',
       };

       var formTemp = qs.stringify(form);
       var formData = formTemp.replace('placeholder', keyword);

       var contentLength = formData.length;

       function turntoNextPage(pageIndex, form){
         var curr = 'pageNo=' + pageIndex;
         var nextIndex = Number(pageIndex) + 1;
         //console.log('currently scraping page NO.' + nextIndex);
         var next = 'pageNo=' + nextIndex;
         formData = form.replace(curr, next);
         return formData;
       }


       var mkdirSync = function (path) {
         try {
           fs.mkdirSync(path);
         } catch(e) {
           if ( e.code != 'EEXIST' ) throw e;
         }
       }

       function keepGoing(formData, contentLength) {
         request({
             headers: {
                 'Connection': 'keep-alive',
                 'Content-Length': contentLength,
                 'Cache-Control': 'max-age=0',
                 'Origin': 'http://disclosure.szse.cn',
                 'Upgrade-Insecure-Requests': 1,
                 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36',
                //'Content-Type':'text/html;charset=gb2312',
                 'Content-Type':'application/x-www-form-urlencoded',
             //    'Content-Type' : 'multipart/form-data',
                 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                 'Referer': 'http://disclosure.szse.cn/m/search0425.jsp',
                 'Accept-Encoding': 'gzip, deflate',
                 'Accept-Language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,zh-TW;q=0.2,de;q=0.2',
                 'Cookie': '',
             },
             uri: 'http://disclosure.szse.cn/m/search0425.jsp',
             body: formData,
             method: 'POST',
             encoding: null,
           }, function (err, res, body) {
            //console.log(res.statusCode);
            //var buffBody = new Buffer(body);
            if (err || !res || !body) {
              return;
            }
             var newBody = iconv.decode(body,'gb2312');
             //console.log(newBody);
             var $ = cheerio.load(newBody);
             var target = $('td>a');
             if (target.length <= 2) {
               return;
             }

             if (form.stockCode !== '') {
               mkdirSync(path.join(form.stockCode));
             }

            for (var j = 0; j < target.length  - 2; ++j) {
              var domain = 'http://disclosure.szse.cn/';
              var address = target[j].attribs['href'];
              var counter = 0;
              var k = address.length - 1;
              var ext = '';
              while (address[k] != '.') {
                ext = address[k] + ext;
                k--;
              }
              ext = '.' + ext;
              var downloadURL = domain + address;
              //var filename = address.substring(21);
              var filename = target[j].children[0].data;
              //console.log(filename);
              //var year = address.substring(10, 14);
              var pubDate = address.substring(10, 20);

            /*
              console.log(year);
              if (form.stockCode !== '') {
                var saveDir = './' + form.stockCode+'/'+ year +'/' + filename + ext;
                mkdirSync(path.join(form.stockCode+'/'+year));
              } else {
                var saveDir = './' + year +'/' + filename + ext;
                mkdirSync(path.join(year));
              }
              */

              var saveDir = './' + form.stockCode +'/' + filename + '_' + pubDate+ext;


              var csvPath = './downloadCatlaog.csv';
              var content = [pubDate, form.stockCode, filename, '\r\n'].join(',');
/*
              var fileBuff = [];
              var requestPDF = request.get(downloadURL);
              requestPDF.on('error', function(err) {
                console.log('request file error: ' + err);
              })
              requestPDF.on('data', function(chunk){
                var buffer = new Buffer(chunk);
                fileBuff.push(buffer);
              });
              requestPDF.on('end', function(){
                var totalBuff = Buffer.concat(fileBuff);
                fs.writeFile(saveDir, totalBuff,function(err){
                  if (err) {
                    console.log('saving file error: '+ err);
                  }
                })
              });
*/
              var writing = request.get(downloadURL).on('error', function(err) {
                if (err) {
                    console.log('stream error: ' + err);
                }
              }).pipe(fs.createWriteStream(saveDir));

              writing.on('close', function(){
                console.log('part of '+ form.stockCode +' ' + pubDate + " completed");
              })

/*
              request.get(downloadURL).on('error', function(err) {
                console.log('stream error: ' + err);
              }).pipe(fs.createWriteStream(saveDir));

              var downloadDOC = function(downloadURL, saveDir, callBack) {
                request.get(downloadURL).on('error', function(err) { console.log('hey' + err); }).pipe(fs.createWriteStream(saveDir)).on('close', callBack);
              };

              downloadDOC(downloadURL, saveDir, function(){
                  console.log(filename + ' done');
              }) */




              fs.appendFile(csvPath,content,function(err){
                if (err) throw err;
              });

            }

            var currentPage = $('td.page12').find('span')[0].children[0].data;
            var totalPage = $('td.page12').find('span')[1].children[0].data;

            if (currentPage != totalPage) {
              var newForm = turntoNextPage(currentPage, formData);
              var newContentLength = newForm.length;
              keepGoing(newForm, newContentLength);
            } else {
              //console.log(form.stockCode +' search finished. Please wait for all your docs to be downloaded before pressing control + c to procceed.');
            }
           });
       }

     keepGoing(formData, contentLength);
  }




module.exports = handler;
