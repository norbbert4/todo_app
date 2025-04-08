
const setCSS = async() => {
    const skinLink = document.querySelector('#skinlink');
    const get_apiUrl = `${apiUrl}?token=${userData.token}&userid=${userData.user_ID}&entity=skins&entityid=1&count=1`;
    const res = await fetch(get_apiUrl);
    const resjson = await res.json();
    console.log('GET válasz:', resjson); // Naplózás a hibakereséshez
    let selectedSkinDir = 'default';
    if (resjson.type === 'result') {
        selectedSkinDir = resjson.body;
        console.log(selectedSkinDir);
        skinLink.setAttribute('href', './assets/css/'+selectedSkinDir.css_file+'/'+pageCSS);
    }
    else {
        console.error('hiba:', resjson.message);
        console.log(resjson.message);
    }
}

setCSS();