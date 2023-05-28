import LibCrud from '../../lib/LibCrud';
import LibConfig from '../../lib/LibConfig';
import HttpCommon from '../../lib/HttpCommon';
//
const CrudIndex = {
  /**
  *
  * @param
  *
  * @return
  */
  getTotalCount : function (items: any[]): any  
  {
    try{
      let retCount = 0;
      items.forEach(item => {
//        console.log("count= ", item.count);
        retCount = retCount + item.count;
      });
      return retCount;
    } catch (e) {
      console.error(e);
      throw new Error("Error, getTotalCount");
    } 
  }  ,  
  /**
  * getList
  * @param
  *
  * @return
  */
  getList :async function (): Promise<any>
  {
    try{
      const json = await HttpCommon.post({}, "/repo_count/get_list");
//console.log(json);      
      let items: any[] = [];
      items = json.data;
//      const c = this.getTotalCount(items)
//console.log(d);
      return items;
    } catch (e) {
      console.error(e);
      throw new Error("Error, getList");
    } 
  }  ,  
  /**
  * startProc
  * @param
  *
  * @return
  */   
  startProc :async function (): Promise<void> 
  {
    try{
      console.log("#startProc");
      const valid = await LibCrud.validLogin();
//console.log("valid=", valid);
      if(valid === false) {
        alert("NG, valid Login");
      }
    } catch (e) {
      console.error(e);
    }    
  } 
}
//
//CrudIndex.startProc();

export default CrudIndex;
