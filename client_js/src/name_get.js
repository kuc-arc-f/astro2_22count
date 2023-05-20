const fetch = require('node-fetch');
const HttpCommon = require('./lib/HttpCommon');
const LibConfig = require('./lib/LibConfig');
const GIT_USER_NAME = "hoge123";
//
const GitAdd = {
  /**
  *
  * @param
  *
  * @return
  */  
  getRepoItems: async function(page){
    try{
      let ret = [];
//      let page = 1;
      
      const url = `https://api.github.com/users/${GIT_USER_NAME}/repos?sort=created&page=${page}`;
      console.log("url=", url)
      const response = await fetch(url);
      const data = await response.json();
console.log(data);
      ret = data;
      return ret
    } catch (err) {
      console.log(err);
      throw new Error('error, getRepoItems');
    } 
  },
  /**
  *
  * @param
  *
  * @return
  */  
  getArray: async function(){
    try{
      let ret = [];
      let page = 1;
      const max = 2;
      let data = [];
      //delete
      const postItem = {
        "api_key": LibConfig.API_KEY
      };      
      const resultDelete = await HttpCommon.post(postItem, '/repo_name/delete_all');
// console.log("ret=", resultDelete.ret);
      if(resultDelete.ret !== "OK") {
        throw new Error('error, getArray, resultDelete');
      }      
      /*
      */
      //
      for(let i = 0; i < max; i++) {
        page = i + 1;
        let oneItems = await this.getRepoItems(page);
console.log(page);
//console.log(oneItems);
        data = data.concat(oneItems);
      }
console.log("getArray.len=", data.length);
      //add
      const result = await this.addItems(data);
      return data
    } catch (err) {
      console.log(err);
      throw new Error('error, getArray');
    } 
  },   
  /**
  *
  * @param
  *
  * @return
  */  
  addItems: async function(items){
    try{
      let ret = false;
      const len = items.length
      //send_post
      for(let i= 0; i < len; i++) {
        let item = items[i]
        let name = item.name;
console.log("name=", name);
        const postItem = {
          "api_key": LibConfig.API_KEY,
          "name": name
        };
        const result = await HttpCommon.post(postItem, '/repo_name/create');
//        console.log("ret=", result.ret);
        if(result.ret !== "OK") {
          throw new Error('error, HttpCommon.post');
        }
      }
      ret = true;
      return ret
    } catch (err) {
      console.log(err);
      throw new Error('error, addItems');
    } 
  },
}

/* main */
GitAdd.getArray();

