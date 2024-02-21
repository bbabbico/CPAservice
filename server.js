const mysql      = require('mysql');
var express      = require('express');
var puppeteer = require('puppeteer');
const path = require('path');
const crypto = require('crypto');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
var app = express()
app.use(cookieParser());

var cors = require('cors') //cors 설정해야 API 접근가능함
app.use(cors({origin : true, credentials : true}))

app.use(express.json()) //post 방식 사용하기위해 받는 형식 설정
app.use(express.urlencoded({extended:true})) //form 받기

app.use(express.static(path.join(__dirname, 'views')));

app.set('view engine', 'ejs'); //로그인을 위한 EJS 페이지 사용
app.set('views', './views');

///////ejs 사이트 활성화
app.get('/login', (req, res) => {
  res.render('login');
})

app.get('/register', (req, res) => {
  res.render('register');
})

app.get('/index', (req, res) => {
  res.render('index');
})

app.get('/search', (req, res) => {
  res.render('search');
})

app.get('/analyze', (req, res) => {
  res.render('analyze');
})

app.get('/extraction', (req, res) => {
  res.render('extraction');
})

app.get('/savelist', (req, res) => {
  res.render('savelist');
})

// sql 연결
const connection = mysql.createConnection({
  host     : '222.235.231.198',
  user     : 'newuser',
  password : '(ehgus2003)',
  database : 'solodb'
});
connection.connect();

//chrome 브라우저 크롤링 함수
var browser
async function scrapeData(url,type) {
  try {
    const browser = await puppeteer.launch({ //배포용 서버 전용
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url);
    
    await page.waitForSelector('.goods_buyinfo'); // 클릭할 버튼이 로드 될 때까지 Wait
    await page.click('.goods_buyinfo'); // 썸네일 버튼 클릭
    await page.waitForSelector('#artcInfo .detail_info_list'); //텍스트 로딩 기다리기

    //상품정보 크롤링
    const infor = await page.evaluate(() => {

      const img = document.querySelector('#mainImg');
      const name = document.querySelector('.prd_name').innerHTML;
      const brand = document.querySelector('#moveBrandShop').innerHTML;
      const ingredient = document.querySelector('#artcInfo .detail_info_list:nth-child(8) dd').innerHTML;

      const infor ={
          'url' : `${window.location.href}`,
          'img' : `${img.src}`,
          'name' : `${name}`,
          'brand' : `${brand}`,
          'ingredient' : `${ingredient}`
      }
      return infor
    });
    if (infor.length===0){
      console.log('좆됨')
    }
    await browser.close();

    response ={'type' : type}
    result = Object.assign(infor,response)
    return result
  }
    catch (error) {
    console.error(error);
  }

}

//비밀번호 해쉬 변환 함수
function hash(password){
  const salt = 'CPASERVICE';
  const hash =crypto.pbkdf2Sync(password,salt,1000,32,'sha512').toString("hex")
  return hash
}

////////////////////////////////////미들 웨어 API
app.get('/s',function (req,res) {
  const temp = req.query
  console.log(temp.input);
  switch(temp.condition){
    case '품명' :
      connection.query('SELECT * from qqq where name like '+'"%'+temp.input+'%";', (error, rows, fields) => {
       if (error) throw error;
       res.json(rows);
      });
    break;
    case '브랜드':
    connection.query('SELECT * from qqq where brand like '+'"%'+temp.input+'%";', (error, rows, fields) => {
      if (error) throw error;
      res.json(rows)
      });
    break;
    case '종류':
    connection.query('SELECT * from qqq where type like '+'"%'+temp.input+'%";', (error, rows, fields) => {
      if (error) throw error;
      res.json(rows)
      });
    break;  
    case '성분':
    connection.query('SELECT * from qqq where ingredient like '+'"%'+temp.input+'%";', (error, rows, fields) => {
      if (error) throw error;
      res.json(rows)
      });
    break;
  }
 // connection.end();
})

app.get('/load/:id',function (req,res) {
  const temp = req.params
  connection.query('SELECT * from usersave where userid like '+"'"+temp.id+"';", (error, rows, fields) => {
    if (error) throw error;
    res.json(rows)
    });
  // connection.end();
})

app.get('/add',function (req,res) {
  
  //URL 이스케이프 문자 변환
  const temp = req.query
  link_url=temp.link_url.replaceAll('___slash___','/')
  link_url=link_url.replaceAll('___colon___',':')
  link_url=link_url.replaceAll('___percent___','%')
  link_url=link_url.replaceAll('___dot___','.')

  link_img=temp.link_img.replaceAll('___slash___','/')
  link_img=link_img.replaceAll('___colon___',':')
  link_img=link_img.replaceAll('___percent___','%')
  link_img=link_img.replaceAll('___dot___','.')

  connection.query(`insert into usersave values('${temp.userid}','${link_url}','${link_img}','${temp.name}','${temp.brand}','${temp.type}','${temp.ingredient}');`, (error, rows, fields) => {
    if (error) throw error;
    res.json(rows)
    });
  // connection.end();
})

app.get('/del',function (req,res) {
  const temp = req.query
  connection.query(`DELETE FROM usersave WHERE (usersave.userid like '${temp.userid}')and(usersave.name like '${temp.name}');`, (error, rows, fields) => {
    if (error) throw error;
    res.json(rows)
    });
  // connection.end();
})



app.get('/crawling',function (req,res) { /////////////////////////////////////////////////////////////////////////////////////////////////////
  const temp = req.query;
  var url=temp.url.replaceAll('___slash___','/');
  url=url.replaceAll('___colon___',':');
  url=url.replaceAll('___percent___','%');
  url=url.replaceAll('___dot___','.');
  url=url.replaceAll('___mool___','?');

  scrapeData(url,temp.type).then(data=>{res.send(data)})
})

app.get('/crawlingadd',function (req,res) { /////////////////////////////////////////////////////////////////////////////////////////////////////
  
  //URL 이스케이프 문자 변환
  const temp = req.query
  url=temp.url.replaceAll('___slash___','/')
  url=url.replaceAll('___colon___',':')
  url=url.replaceAll('___percent___','%')
  url=url.replaceAll('___dot___','.')

  img=temp.img.replaceAll('___slash___','/')
  img=img.replaceAll('___colon___',':')
  img=img.replaceAll('___percent___','%')
  img=img.replaceAll('___dot___','.')


  connection.query(`insert into qqq values('${url}','${img}','${temp.name}','${temp.brand}','${temp.type}','${temp.ingredient}');`, (error, rows, fields) => {
    if (error) throw error;
    res.json(rows)
    });
  // connection.end();
})

//회원가입
app.post('/register/req',(req,res)=>{
  var email =req.body.email;
  var id =req.body.id;
  var ps = req.body.ps;
  var queryid = `INSERT INTO users values('${email}','${id}','${hash(ps)}');`

  connection.query(queryid,(error, rows, fields) => {
      if (error) throw error;
      else{ 
          res.send({res : '회원가입 성공'})
          
              
      }

  });
  
})

//로그인
app.post('/login/req',(req,res)=>{ 
  var id =req.body.id;
  var ps = req.body.ps;
  var queryid = 'SELECT userid,password from users where userid = '+"'"+id+"';";
  
  connection.query(queryid,(error, rows, fields) => {
      if (error) throw error;
      
      else{
          if(rows.length===0){
              res.send({res : '아이디 틀림'});
              
          }else if(rows[0].password===hash(ps)){
              res.cookie('login', rows[0].userid,{maxAge : 100*1000});
              res.send({res : '로그인 성공'})

          }else{
              res.send({res : '비번틀림'});
          }
      }
  });

})

//로그아웃
app.get('/logout', (req, res) => {
  res.clearCookie('login');
  res.send({res : '로그아웃'})
});

app.listen(5000);
console.log('Server is listening on port 5000');
