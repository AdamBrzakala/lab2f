let db;

window.onload = () => {
    var request = indexedDB.open('clientData', 1);

    request.onupgradeneeded = function (e) {

        db = e.target.result;

        if (!db.objectStoreNames.contains('user')) {

            var objectStore = db.createObjectStore('user', { keyPath: 'id' });
            objectStore.createIndex('id', 'id', { unique: false });
            objectStore.createIndex('email', 'email', { unique: false });
            objectStore.createIndex('zipcode', 'zipcode', { unique: false });
            objectStore.createIndex('nip', 'nip', { unique: false });
            objectStore.createIndex('dowod', 'dowod', { unique: false });
            objectStore.createIndex('ip4', 'ip4', { unique: false });
            objectStore.createIndex('www', 'www', { unique: false });
            objectStore.createIndex('diskA', 'diskA', { unique: false });
            objectStore.createIndex('diskB', 'diskB', { unique: false });
            objectStore.createIndex('ip6', 'ip6', { unique: false });
            objectStore.createIndex('catalog', 'catalog', { unique: false });
            objectStore.createIndex('phone', 'phone', { unique: false });
        }
    }

    request.onsuccess = function (e) {
        console.log('Database opened!');
        db = e.target.result;
        loadData();
    }

    request.onerror = function (e) {
        console.log('Database opening error!');
    }
};

function remove(elem) {
    elem.parentElement.remove();
}

function loadData() {
    const request = db.transaction('user').objectStore('user').getAll();

    request.onsuccess = () => {
        document.getElementById('klienci').innerHTML = JSON.stringify(request.result);
    }

    request.onerror = (err) => {
        console.error(`Error on loadData() function`)
    }
}

function saveData() {
    var newUser = getclientData();
    const transaction = db.transaction(['user'], 'readwrite');
    const objectStore = transaction.objectStore('user');
    const request = objectStore.put(newUser);
    request.onsuccess = event => {
        loadData();
    };
}


function makeid(length) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function makeid2(length) {
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function exampleText() {
    var email = document.getElementById('email');
    var zipcode = document.getElementById('zipcode');
    var nip = document.getElementById('nip');
    var dowod = document.getElementById('dowod');
    var ip4 = document.getElementById('ip4');
    var www = document.getElementById('www');
    var diskA = document.getElementById('diskA');
    var diskB = document.getElementById('diskB');
    var ip6 = document.getElementById('ip6');
    var catalog = document.getElementById('catalog');
    var phone = document.getElementById('phone');

    email.value = makeid(5) + "@gmail.com";
    zipcode.value = makeid2(2) + "-" + makeid2(3);
    nip.value = makeid2(3) + "-10-20-200";
    dowod.value = "ABC " + makeid2(6);
    ip4.value = makeid2(3) + "." + makeid2(3) + ".1.1";
    www.value = "www." + makeid(6) + ".com";
    diskA.value = 'c:\\windows\\' + makeid(6);
    diskB.value = "C:\\Windows\\" + makeid(6);
    catalog.value = "/etc/passwd/" + makeid(4);
    ip6.value = makeid2(4) + ":0db8:85a3:0000:0000:8a2e:0370:7334";
    phone.value = makeid2(3) + " 492 492";
}

function clearText() {
    var email = document.getElementById('email');
    var zipcode = document.getElementById('zipcode');
    var nip = document.getElementById('nip');
    var dowod = document.getElementById('dowod');
    var ip4 = document.getElementById('ip4');
    var www = document.getElementById('www');
    var diskA = document.getElementById('diskA');
    var diskB = document.getElementById('diskB');
    var ip6 = document.getElementById('ip6');
    var catalog = document.getElementById('catalog');
    var phone = document.getElementById('phone');
    email.value = "";
    zipcode.value = "";
    nip.value = "";
    dowod.value = "";
    ip4.value = "";
    www.value = "";
    diskA.value = "";
    diskB.value = "";
    catalog.value = "";
    ip6.value = "";
    phone.value = "";

    var request = db.transaction(["user"], "readwrite")
        .objectStore("user")
        .clear();

    request.onsuccess = event => {
        loadData();
    };

    document.getElementById('wyszukiwanie').innerHTML = "";
}

function getclientData() {

    var email = document.getElementById('email').value;
    var zipcode = document.getElementById('zipcode').value;
    var nip = document.getElementById('nip').value;
    var dowod = document.getElementById('dowod').value;
    var ip4 = document.getElementById('ip4').value;
    var www = document.getElementById('www').value;
    var diskA = document.getElementById('diskA').value;
    var diskB = document.getElementById('diskB').value;
    var ip6 = document.getElementById('ip6').value;
    var catalog = document.getElementById('catalog').value;
    var phone = document.getElementById('phone').value;

    return {
        id: new Date().getTime(),
        email: email,
        zipcode: zipcode,
        ip4: ip4,
        nip: nip,
        dowod: dowod,
        www: www,
        diskA: diskA,
        diskB: diskB,
        ip6: ip6,
        catalog: catalog,
        phone: phone
    }
}

function searchUser() {
    var email_re = document.getElementById('search_email').value;
    document.getElementById('wyszukiwanie').innerHTML = "";
    
    var transaction = db.transaction(["user"], "readwrite");
    var objectStore = transaction.objectStore("user");
    var request = objectStore.openCursor();

    request.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            if (new RegExp(email_re).test(cursor.value.email)) {                
                document.getElementById('wyszukiwanie').innerHTML += JSON.stringify(cursor.value) + "\n\n";
            }

            cursor.continue();          
        }
    };
}

function deleteUser() {
    var userid = document.getElementById('delete_id').value;
    var transaction = db.transaction(["user"], "readwrite");
    var objectStore = transaction.objectStore("user");
    var request = objectStore.openCursor();

    request.onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log(cursor.value.id);           

            if (userid === String(cursor.value.id)) {
                cursor.delete();
                loadData();
                searchUser();
            }

            cursor.continue();          
        }
    };
}
