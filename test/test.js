const Securescan = artifacts.require('./Securescan.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Securescan', ([deployer, author, tipper]) => {
  let decentragram

  before(async () => {
    decentragram = await Securescan.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await decentragram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await decentragram.name()
      assert.equal(name, 'akhilesh')
    })
  })

  describe('datastore', async () => {
    let result, imageCount
    const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZE2J1rA44qgrBCr739BN9Wb'


    it('add a product', async () => {
      result = await decentragram.storeData(hash, { from: author })

console.log(result.logs)

    })

    it('has a product', async () => {

// var ans = decentragram.storeData1((error,result)=>{
//   if (!error)console.log(result)
// })
   console.log( await decentragram.identifier(hash))
      // imageCount = await decentragram.identifier(hash)
         await decentragram.indentifayProduct(hash)
          console.log('before calling again storeData',await decentragram.identifier(hash))
      // console.log(imageCount)
   result =  await decentragram.storeData('23423', { from: author })
console.log('over',result.logs)
var ans = await decentragram.storeData1((error,result1)=>{
  if (!error)console.log("lvoer",result1)
})
console.log(ans)
    // console.log( "after calling again storeData",await decentragram.identifier(hash))
    })


   
  })
})
