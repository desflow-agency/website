import type {
    MessageHistory
   } from "../types";
   
   
   
   export function HistoryList({
   
   history
   
   }:{
   
   history:MessageHistory[];
   
   }){
   
   
   return (
   
   <div>
   
   
   <h4 className="
    font-semibold
    mb-2
   ">
   
   Historia zmian
   
   </h4>
   
   
   
   <div className="
    space-y-2
   ">
   
   
   {
   history.map(
   (item)=>(
   
   <div
   
   key={
   item.id
   }
   
   className="
    rounded-xl
    bg-gray-50
    p-3
    text-sm
   "
   
   >
   
   <p>
   {item.action}
   </p>
   
   <p className="
    text-xs
    text-gray-500
   ">
   
   {
   new Date(
   item.date
   ).toLocaleString()
   }
   
   </p>
   
   
   </div>
   
   
   )
   )
   }
   
   
   </div>
   
   
   </div>
   
   );
   
   
   }