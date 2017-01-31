# sz
## Usage
The `sz.js` is a simple command line program based on Node.js that helps user batch-download public documents from China's Shenzhen Stock Exchange.
## The 'api' 
###General Form
`sz(stockCode, keyword, docType, startDate, endDate)`
### Parameters
`stockCode`: <integer> a six-digit number that denotes the assigned code for the target stock. For example, '000001' stands for Ping An Bank (平安银行）. A full list can be found <a href='https://en.wikipedia.org/wiki/List_of_companies_listed_on_the_Shenzhen_Stock_Exchange'> here </a>.

`keyword`: <string>, the specific word that the target document should contain in its title. The keyword must only consist of **Chinese Character**.

`docType`: <integer> optional. A digit number that indicates the desired document type. More specifically:
- 010301 年度报告
- 010303 半年度报告
- 010305 一季度报告
- 010307 三季度报告
- 0102 首次公开发行及上市
- 0105 配股
- 0107 增发
- 0109 可转换债券
- 0111 其它融资
- 0110 权证相关公告
- 0113 title="权益分派及限制出售股份上市">权益分派及限制出售股份上市
- 0115 股权变动
- 0117 交易
- 0119 股东大会
- 0121 title="澄清、风险提示、业绩预告事项">澄清、风险提示、业绩预告事项
- 0127 补充及更正
- 0125 特别处理和退市
- 0129 中介机构报告
- 0131 上市公司制度
- 0123 其它重大事项  

`startDate`: <string> A date in `yyyy-mm-dd` form, setting a beginning date of the time frame of the search. Default Value is "2001-01-01"

`endDate`: <string> A date in `yyyy-mm-dd` form, setting an ending date of the time frame of the search. Default Value is set to the date when the search actually takes place.

### Example
`sz(000001, "董事会", "", "", "")` will search for all the public documents that contain the word `董事会` in the title published by `Ping An Bank` from `01/01/2001` to `today`.
### Output
- A folder containing all the public documents that fall into search criteria.
- A CSV file serving as a catalog for all downloaded files.
