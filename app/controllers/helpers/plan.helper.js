const findDonsideration = (plan, did) => {
    return plan.donsiderations.find((donsideration) => donsideration._id == did)
}
const findOption = (donsideration, oid) => {
    return donsideration.options.find((option)=> option._id == oid)
}
const findPro = (option, prid) => {
    return option.pros.find((pro) => pro._id == prid)
}
const findCon = (option, cid) => {
    return option.cons.find((con) => con._id == cid)

}
const insertItem = (collection, newItem)=>{
    return [...collection, newItem]
}
const insertDonsideration = (plan, donsideration) => {

    plan.donsiderations = [...plan.donsiderations, donsideration]
    return plan
}
const insertOption = (donsideration, option) => {
    donsideration.options = [...donsideration.options, option]
    return donsideration
}
const insertPro = (option, pro) => {
    option.pros = [...option.pros, pro]
    return option
}
const insertCon = (option, con) => {
    option.cons = [...option.cons, con]
    return option
}

const replaceItem = (collection,id, newItem)=>{
    const newCollection = collection.map((item)=>{
        if(item._id == id){
            return item = newItem
        }else{
            return item
        }
    })
    return newCollection
}
const updateDonsideration = (plan, did, newDonsideration) => { 
    plan.donsiderations = plan.donsiderations.map((donsideration)=>{
        if(donsideration._id == did){
           return donsideration = newDonsideration
        }else{
            return donsideration
        }
    })
    return plan
}
const updateDonsiderationOption = (donsideration, oid, newOption) => { 
    donsideration.options = donsideration.options.map((option)=>{

    })
}
const updatePro = () => { }
const updateCon = () => { }

const Helpers = {
    replaceItem,
    insertItem,
    findDonsideration,
    findOption,
    findPro,
    findCon
}

module.exports = Helpers