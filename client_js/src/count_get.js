const fetch = require('node-fetch');
const HttpCommon = require('./lib/HttpCommon');
const LibConfig = require('./lib/LibConfig');
const GIT_USER_NAME = "hoge123";
const GIT_TOKEN = "";
//
const GitAdd = {
  /**
  *
  * @param
  *
  * @return
  */  
  getRepoNames: async function(){
    try{
      let ret = [];
      const postItem = {
        "api_key": LibConfig.API_KEY,
      };
      const resNames = await HttpCommon.post(postItem, '/repo_name/get_list');
      //        console.log("ret=", result.ret);
      if(resNames.ret !== "OK") {
        throw new Error('error, HttpCommon.post');
      }
      ret = resNames.data;
console.log(resNames.data);
      return ret
    } catch (err) {
      console.log(err);
      throw new Error('error, getRepoNames');
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
      const resultDelete = await HttpCommon.post(postItem, '/repo_count/delete_all');
      if(resultDelete.ret !== "OK") {
        throw new Error('error, getArray, resultDelete');
      }      
      let nameItems = await this.getRepoNames();
//console.log(nameItems);
      data = await this.getRepoData(nameItems);
      console.log("#getRepoData.end");
      console.log(data);
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
  getRepoData: async function(items){
    try{
      let ret = [];
      const len = items.length
      //const len = 10;
      //send_post
      for(let i= 0; i < len; i++) {
        let item = items[i]
console.log("name=", item.name);
        let url = `https://api.github.com/repos/${GIT_USER_NAME}/${item.name}/traffic/clones?per=week`
console.log(url);   
        let response = await fetch(url, {
          method: 'GET', headers: { 'Authorization': 'token ' + GIT_TOKEN },
        });
        let status = await response.status
        if (status === 200) {
          let json =  await response.json()
          item.count = json.count
          item.uniques = json.uniques
//console.log(json );
          ret.push(item)
        } else {
          console.log('error, getRepoData')
          throw new Error('error, getRepoData.fetch');
        }         
      }
//console.log(ret );
      return ret
    } catch (err) {
      console.log(err);
      throw new Error('error, getRepoData');
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
      console.log("#addItems_start");
      let ret = false;
      const len = items.length
      //send_post
      for(let i= 0; i < len; i++) {
        let item = items[i]
//console.log(item);
        let postItem = {
          "api_key": LibConfig.API_KEY,
          "count": item.count,
          "uniques": item.uniques,
          "repoId": item.id,
        };
//console.log(postItem);
        const result = await HttpCommon.post(postItem, '/repo_count/create');
// console.log("ret=", result.ret);
        if(result.ret !== "OK") {
          throw new Error('error, addItems.HttpCommon.post');
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

