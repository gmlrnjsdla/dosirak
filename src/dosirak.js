const { app } = require('electron');
const fs = require('fs');
const path = require('path');

// properties 파일 경로
const propertiesPath = path.join(__dirname, '..' , 'data.properties');

function readPropertiesFile(callback) {
  fs.readFile(propertiesPath, 'utf8', (err, data) => {
    if (err) {
      console.error('파일 읽기 오류:', err);
      return;
    }

    const properties = parsePropertiesData(data);
    callback(properties);
  });
}

function start() {
  readPropertiesFile(properties => {
    const menu = properties.menu;    
    const main = properties.main;

    const randomNumber1 = Math.floor(Math.random() * menu.length);
    const randomNumber2 = Math.floor(Math.random() * menu.length);
    const randomNumber3 = Math.floor(Math.random() * main.length);

    if (randomNumber1 === randomNumber2) {
      start();
    } else {
      const container1 = document.getElementById('menu1');
      container1.textContent = menu[randomNumber1];

      const container2 = document.getElementById('menu2');
      container2.textContent = menu[randomNumber2];

      const container3 = document.getElementById('main');
      container3.textContent = main[randomNumber3];
    }
  });
}

function updatePropertiesFile(key, value) {
  fs.readFile(propertiesPath, 'utf8', (err, data) => {
    if (err) {
      console.error('파일 읽기 오류:', err);
      return;
    }

    const properties = parsePropertiesData(data);

    if (key === 'menu') {
      const menu = Array.isArray(properties[key]) ? properties[key] : [];
      menu.push(value);
      properties[key] = menu;
    } else if (key === 'main') {
      const main = Array.isArray(properties.main) ? properties.main : [];
      main.push(value);
      properties.main = main;
    } else {
      console.error('잘못된 키입니다.');
      return;
    }

    const newData = propertiesToString(properties);

    fs.writeFile(propertiesPath, newData, 'utf8', err => {
      if (err) {
        console.error('파일 쓰기 오류:', err);
        return;
      }
      alert('저장 완료!');  
      location.reload();    
    });
  });
}

function parsePropertiesData(data) {
  const lines = data.split('\n');
  const properties = {};

  for (let line of lines) {
    line = line.trim();
    if (line !== '') {
      const parts = line.split('=');
      const key = parts[0].trim();
      const value = parts[1].trim();
      properties[key] = JSON.parse(value);
    }
  }

  return properties;
}

function propertiesToString(properties) {
  let newData = '';

  for (let key in properties) {
    const value = JSON.stringify(properties[key]);
    newData += `${key}=${value}\n`;
  }

  return newData;
}



function displayProperties() {
    readPropertiesFile(properties => {
      const menu = properties.menu;      
      const main = properties.main;
  
      const containerMenu = document.getElementById('propertiesContainerMenu');
      const containerMain = document.getElementById('propertiesContainerMain');
  
      // menu1 출력
      const menuList = document.createElement('ul');
      for (let item of menu) {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        menuList.appendChild(listItem);
      }
      containerMenu.appendChild(menuList);
  
      // main 출력
      const mainList = document.createElement('ul');
      for (let item of main) {
        const listItem = document.createElement('li');
        listItem.textContent = item;
        mainList.appendChild(listItem);
      }
      containerMain.appendChild(mainList);
    });
  }