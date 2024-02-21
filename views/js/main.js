//메인 서버 주소
const main_url ='https://port-0-cpaservicereal-dc9c2nlss8snjp.sel5.cloudtype.app/';
//https://port-0-cpaservicereal-dc9c2nlss8snjp.sel5.cloudtype.app/
//http://localhost:5000/

function 검색(select_type,input_searche_value){
    //결과 초기화
    const table = document.getElementById('container');
    const num = table.rows.length;

    // (table 모든 행 개수 - 1) 개 만큼 삭제 [인덱스 행 제외]
    for(let i = 0;i<(num-1);i++){
        var qwe = document.querySelector('.del');
        qwe.remove()};

    // 검색 fetch 요청 보내고 목록받기 (회원)
    const p =getCookie('login');
    if(p!==null){
    fetch(`${main_url}s?condition=${select_type}&input=${input_searche_value}`)
    .then((response)=>response.json())
    .then((data) => 
    data.forEach(elem => {
        document.querySelector("#container tbody").innerHTML += `
            <tr class='del'>
                <td><a href="${elem.link_url}" target="_blank"><img src="${elem.link_img}" width="150" height="150" alt="이미지 없다 시발아"><a></td>
                <td>${elem.name}</td>
                <td>${elem.brand}</td>
                <td>${elem.type}</td>
                <td>${elem.ingredient}</td>
                <td id='${elem.name}'>
                    <button id="저장소에추가" onclick="add_user('${p}','${elem.link_url}','${elem.link_img}','${elem.name}','${elem.brand}','${elem.type}','${elem.ingredient}')">
                    ${p}님의 저장소에 추가</button></td>
            </tr>`;
        })).then( (HTML)=> {
            count = document.querySelector('#container')
            count=(count.rows.length-1)
            document.getElementById('count').innerHTML=`총 <span class='green'>${count}</span>건의 자료가 검색되었습니다.`
        })
    
        .catch((error) =>
            document.querySelector("#container").innerHTML += `
            <tr>
                <td colspan="4" class='del'>Error occurred.</td>
            </tr>
        `);

    }
    else
    {
        // 검색 fetch 요청 보내고 목록받기 (비회원)
    fetch(`${main_url}s?condition=${select_type}&input=${input_searche_value}`)
    .then((response)=>response.json())
    .then((data) => 
    data.forEach(elem => {
        document.querySelector("#container tbody").innerHTML += `
            <tr class='del'>
                <td><a href="${elem.link_url}" target="_blank"><img src="${elem.link_img}" width="150" height="150" alt="이미지 없다 시발아"><a></td>
                <td>${elem.name}</td>
                <td>${elem.brand}</td>
                <td>${elem.type}</td>
                <td>${elem.ingredient}</td>
            </tr>`;
        })).then( (HTML)=> {
            count = document.querySelector('#container')
            count=(count.rows.length-1)
            document.getElementById('count').innerHTML=`총 <span class='green'>${count}</span>건의 자료가 검색되었습니다.`
        })
    
        .catch((error) =>
            document.querySelector("#container").innerHTML += `
            <tr>
                <td colspan="4" class='del'>Error occurred.</td>
            </tr>
        `);
    }
    }

function 모두삭제(){

    //table 모든 행 개수 = num 
    const table = document.getElementById('container');
    const num = table.rows.length;

    // (table 모든 행 개수 - 1) 개 만큼 삭제 [인덱스 행 제외]
    for(let i = 0;i<(num-1);i++){
        var qwe = document.querySelector('.del');
        qwe.remove()};
}

function del(userid,name){

    // 저장된 제품항목 중에 지울항목 id[userid_name] 형식으로 받기
    temp = document.getElementById(userid+'_'+name);
    temp.remove();

    // 항목삭제 fetch 전송
    fetch(`${main_url}del?userid=${userid}&name=${name}`) 
    .catch((error) =>
        document.querySelector("#container").innerHTML += `
        <tr>
            <td colspan="4" class='del'>Error occurred.</td>
        </tr>
    `);
}

function load(){

    // userid 입력 받기
    const p = getCookie('login');

    // 불러오기 fetch 전송
    fetch(`${main_url}load/${p}`)
    .then((response)=>response.json())
    .then((data) => data.forEach(elem => {  
       document.querySelector("#container").innerHTML += `
            <tr class='del' id='${elem.userid}_${elem.name}'>
                <td>${elem.userid}</td>
                <td><a href="${elem.link_url}" target="_blank"><img src="${elem.link_img}" width="150" height="150" alt="이미지 없다 시발아"><a></td>
                <td>${elem.name}</td>
                <td>${elem.brand}</td>
                <td>${elem.type}</td>
                <td>${elem.ingredient}</td>
                <td><button id="${elem.name}" onclick="add_nouser('${elem.link_url}','${elem.link_img}','${elem.name}','${elem.brand}','${elem.type}','${elem.ingredient}')">공용저장소에 추가</button></td>
                <td><button id="저장소에서제거" onclick="del('${elem.userid}','${elem.name}')">저장소에서 제거</button></td>
            </tr>`;
        }))  
    .catch((error) =>
        document.querySelector("#container").innerHTML += `
        <tr>
            <td colspan="4" class='del'>Error occurred.</td>
        </tr>
    `);
}

function add_user(userid ,url, img, name, brand, type, ingredient){ ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //URL 이스케이프 문자 변환
    url=url.replaceAll('/','___slash___');
    url=url.replaceAll(':','___colon___');
    url=url.replaceAll('%','___percent___');
    url=url.replaceAll('.','___dot___');

    img=img.replaceAll('/','___slash___');
    img=img.replaceAll(':','___colon___');
    img=img.replaceAll('%','___percent___');
    img=img.replaceAll('.','___dot___');

    // 저장 fetch 요청 보내기 ----------------------
    fetch(`${main_url}add_user?userid=${userid}&url=${url}&img=${img}&name=${name}&brand=${brand}&type=${type}&ingredient=${ingredient}`)
    .then(function() {document.getElementById(`${name}`).innerHTML =`${userid}에 저장완료`;});
}

function add_nouser(url, img, name, brand, type, ingredient){ ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //URL 이스케이프 문자 변환
    url=url.replaceAll('/','___slash___');
    url=url.replaceAll(':','___colon___');
    url=url.replaceAll('%','___percent___');
    url=url.replaceAll('.','___dot___');

    img=img.replaceAll('/','___slash___');
    img=img.replaceAll(':','___colon___');
    img=img.replaceAll('%','___percent___');
    img=img.replaceAll('.','___dot___');

    // 저장 fetch 요청 보내기 ----------------------
    fetch(`${main_url}add_nouser?&url=${url}&img=${img}&name=${name}&brand=${brand}&type=${type}&ingredient=${ingredient}`)
    .then(function() {document.getElementById(`${name}`).innerHTML =`저장완료`;});
}

function 크롤링(url,type){ ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    url=url.replaceAll('/','___slash___');
    url=url.replaceAll(':','___colon___');
    url=url.replaceAll('%','___percent___');
    url=url.replaceAll('.','___dot___');
    url=url.replaceAll('?','___mool___');

    const p =getCookie('login');

    if(p!==null){
    // 불러오기 fetch 전송
    fetch(`${main_url}crawling?url=${url}&type=${type}`)
    .then((response)=>response.json())
    .then((elem) => {
        document.querySelector("#container tbody").innerHTML += `
            <tr class='del' id='value'>
                <td><a href="${elem.url}" target="_blank"><img src="${elem.img}" width="150" height="150" alt="이미지 없다 시발아"><a></td>
                <td>${elem.name}</td>
                <td>${elem.brand}</td>
                <td>${elem.type}</td>
                <td>${elem.ingredient}</td>
                <td id='${elem.name}'>
                    <button id="저장소에추가" onclick="add_user('${p}','${elem.url}','${elem.img}','${elem.name}','${elem.brand}','${type}','${elem.ingredient}')">
                    ${p}의 저장소에 추가</button></td>
            </tr>`;
        })
    }else{
        fetch(`${main_url}crawling?url=${url}&type=${type}`)
        .then((response)=>response.json())
        .then((elem) => {
        document.querySelector("#container tbody").innerHTML += `
            <tr class='del' id='value'>
                <td><a href="${elem.url}" target="_blank"><img src="${elem.img}" width="150" height="150" alt="이미지 없다 시발아"><a></td>
                <td>${elem.name}</td>
                <td>${elem.brand}</td>
                <td>${elem.type}</td>
                <td>${elem.ingredient}</td>
                <td id='${elem.name}'>
                    <button id="저장소에추가" onclick="add_nouser('${elem.url}','${elem.img}','${elem.name}','${elem.brand}','${type}','${elem.ingredient}')">
                    저장소에 추가</button></td>
            </tr>`;
        })
    }

}

function getCookie(key) {
        var result = null;
        var cookie = document.cookie.split(';');
        cookie.some(function (item) {
            // 공백을 제거
            item = item.replace(' ', '');
    
            var dic = item.split('=');
    
            if (key === dic[0]) {
                result = dic[1];
                return true;    // break;
            }
        });
        return result;
    }

function logout(){
    fetch(`/logout`)
    
    .then((logo)=>{
        document.getElementById('user_menu').innerHTML = `
        <li><a href="${main_url}login">로그인</a></li>
        <li><a href="${main_url}register">회원가입</a></li>`;
        alert('로그아웃됨');
    })
}
